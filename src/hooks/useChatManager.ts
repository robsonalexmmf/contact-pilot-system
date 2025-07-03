
import { useState, useCallback } from 'react';
import { useVideoCall } from './useVideoCall';

export interface ChatContact {
  id: number;
  contact: string;
  company: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  channel: 'WhatsApp' | 'Email' | 'Chat Site';
  phone?: string;
  email?: string;
}

export interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  type: 'sent' | 'received' | 'system';
  contactId: number;
  videoCallId?: string;
}

export const useChatManager = () => {
  const { createVideoCall, joinVideoCall, endVideoCall, getActiveCallForContact } = useVideoCall();
  
  const [chats, setChats] = useState<ChatContact[]>([
    {
      id: 1,
      contact: "Maria Santos",
      company: "Empresa XYZ",
      lastMessage: "Gostaria de agendar uma reunião para próxima semana",
      timestamp: "14:30",
      unread: 2,
      status: "online",
      channel: "WhatsApp",
      phone: "11999887766",
      email: "maria@empresaxyz.com"
    },
    {
      id: 2,
      contact: "João Silva",
      company: "StartupTech", 
      lastMessage: "Obrigado pelas informações, vou analisar a proposta",
      timestamp: "13:45",
      unread: 0,
      status: "offline",
      channel: "Email",
      phone: "11988776655",
      email: "joao@startuptech.com"
    },
    {
      id: 3,
      contact: "Ana Costa",
      company: "ABC Corp",
      lastMessage: "Podemos conversar sobre os preços?",
      timestamp: "12:20",
      unread: 1,
      status: "away",
      channel: "Chat Site",
      phone: "11977665544",
      email: "ana@abccorp.com"
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "Maria Santos",
      message: "Olá! Estou interessada nos seus serviços de consultoria.",
      timestamp: "14:25",
      type: "received",
      contactId: 1
    },
    {
      id: 2,
      sender: "Você",
      message: "Olá Maria! Fico feliz com o seu interesse. Podemos agendar uma conversa?",
      timestamp: "14:27",
      type: "sent",
      contactId: 1
    },
    {
      id: 3,
      sender: "Maria Santos",
      message: "Gostaria de agendar uma reunião para próxima semana",
      timestamp: "14:30",
      type: "received",
      contactId: 1
    }
  ]);

  const sendMessage = useCallback((contactId: number, message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "Você",
      message,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: "sent",
      contactId
    };

    setMessages(prev => [...prev, newMessage]);

    // Atualizar última mensagem no chat
    setChats(prev => prev.map(chat => 
      chat.id === contactId 
        ? { ...chat, lastMessage: message, timestamp: newMessage.timestamp }
        : chat
    ));

    console.log(`Mensagem enviada para ${contactId}: ${message}`);
    return newMessage;
  }, []);

  const sendVideoInvite = useCallback((contactId: number) => {
    const contact = chats.find(c => c.id === contactId);
    if (!contact) return null;

    const videoCall = createVideoCall(contact);
    
    const inviteMessage: ChatMessage = {
      id: Date.now(),
      sender: "Sistema",
      message: `Convite para videochamada enviado: ${videoCall.inviteLink}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: "system",
      contactId,
      videoCallId: videoCall.id
    };

    setMessages(prev => [...prev, inviteMessage]);

    // Atualizar última mensagem no chat
    setChats(prev => prev.map(chat => 
      chat.id === contactId 
        ? { ...chat, lastMessage: "Convite para videochamada enviado", timestamp: inviteMessage.timestamp }
        : chat
    ));

    console.log(`Convite de videochamada enviado para ${contact.contact}`);
    return videoCall;
  }, [chats, createVideoCall]);

  const markAsRead = useCallback((contactId: number) => {
    setChats(prev => prev.map(chat => 
      chat.id === contactId 
        ? { ...chat, unread: 0 }
        : chat
    ));
  }, []);

  const startCall = useCallback((contact: ChatContact) => {
    if (contact.phone) {
      console.log(`Iniciando ligação para ${contact.contact} (${contact.phone})`);
      if (window.confirm(`Ligar para ${contact.contact}?\nTelefone: ${contact.phone}`)) {
        window.open(`tel:${contact.phone}`);
      }
    } else {
      alert(`Número de telefone não disponível para ${contact.contact}`);
    }
  }, []);

  const startVideo = useCallback((contact: ChatContact) => {
    console.log(`Iniciando videochamada para ${contact.contact}`);
    const videoCall = sendVideoInvite(contact.id);
    
    if (videoCall) {
      // Mostrar notificação de sucesso
      alert(`Convite de videochamada enviado para ${contact.contact}!\nLink: ${videoCall.inviteLink}\n\nO cliente poderá acessar a videochamada através do link enviado na conversa.`);
    }
  }, [sendVideoInvite]);

  const createNewChat = useCallback((contactData: Partial<ChatContact>) => {
    const newChat: ChatContact = {
      id: Date.now(),
      contact: contactData.contact || "Novo Contato",
      company: contactData.company || "",
      lastMessage: "Conversa iniciada",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      status: "online",
      channel: contactData.channel || "Chat Site",
      phone: contactData.phone,
      email: contactData.email
    };

    setChats(prev => [newChat, ...prev]);
    console.log("Novo chat criado:", newChat);
    return newChat;
  }, []);

  const getMessagesForContact = useCallback((contactId: number) => {
    return messages.filter(msg => msg.contactId === contactId);
  }, [messages]);

  const getStats = useCallback(() => {
    const totalChats = chats.length;
    const unreadCount = chats.reduce((sum, chat) => sum + chat.unread, 0);
    const onlineCount = chats.filter(chat => chat.status === 'online').length;
    
    return {
      totalChats,
      unreadCount,
      onlineCount,
      averageResponseTime: "2min",
      satisfaction: "98%"
    };
  }, [chats]);

  return {
    chats,
    messages,
    sendMessage,
    sendVideoInvite,
    markAsRead,
    startCall,
    startVideo,
    createNewChat,
    getMessagesForContact,
    getStats,
    getActiveCallForContact,
    joinVideoCall,
    endVideoCall
  };
};
