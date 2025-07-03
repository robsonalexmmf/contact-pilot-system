
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
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }, []);

  const createVideoCall = useCallback((contact: ChatContact) => {
    const roomId = generateRoomId();
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
