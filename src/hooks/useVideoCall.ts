
import { useState, useCallback } from 'react';
import { ChatContact } from './useChatManager';

export interface VideoCallSession {
  id: string;
  contactId: number;
  roomId: string;
  inviteLink: string;
  status: 'waiting' | 'active' | 'ended';
  startedAt: string;
  participants: string[];
}

export const useVideoCall = () => {
  const [activeCalls, setActiveCalls] = useState<VideoCallSession[]>([]);

  const generateRoomId = useCallback(() => {
    // Gera um código válido para Google Meet usando apenas letras minúsculas
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const generateGroup = () => {
      let result = '';
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    // Formato: xxx-yyyy-zzz (Google Meet aceita este formato)
    const part1 = generateGroup().substring(0, 3);
    const part2 = generateGroup();
    const part3 = generateGroup().substring(0, 3);
    
    return `${part1}-${part2}-${part3}`;
  }, []);

  const createVideoCall = useCallback((contact: ChatContact) => {
    const roomId = generateRoomId();
    // Usar o dominio correto do Google Meet
    const inviteLink = `https://meet.google.com/${roomId}`;
    
    const newCall: VideoCallSession = {
      id: Date.now().toString(),
      contactId: contact.id,
      roomId,
      inviteLink,
      status: 'waiting',
      startedAt: new Date().toISOString(),
      participants: ['Você']
    };

    setActiveCalls(prev => [...prev, newCall]);
    
    console.log(`Videochamada criada para ${contact.contact}:`, newCall);
    return newCall;
  }, [generateRoomId]);

  const joinVideoCall = useCallback((callId: string) => {
    const call = activeCalls.find(c => c.id === callId);
    if (call) {
      setActiveCalls(prev => prev.map(c => 
        c.id === callId 
          ? { ...c, status: 'active' as const }
          : c
      ));
      
      // Abrir o link da videochamada
      window.open(call.inviteLink, '_blank');
      return true;
    }
    return false;
  }, [activeCalls]);

  const endVideoCall = useCallback((callId: string) => {
    setActiveCalls(prev => prev.map(c => 
      c.id === callId 
        ? { ...c, status: 'ended' as const }
        : c
    ));
  }, []);

  const getActiveCallForContact = useCallback((contactId: number) => {
    return activeCalls.find(call => 
      call.contactId === contactId && 
      (call.status === 'waiting' || call.status === 'active')
    );
  }, [activeCalls]);

  return {
    activeCalls,
    createVideoCall,
    joinVideoCall,
    endVideoCall,
    getActiveCallForContact
  };
};
