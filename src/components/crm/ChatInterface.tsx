import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Search, 
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Clock
} from "lucide-react";
import { useChatManager } from "@/hooks/useChatManager";
import { useVideoCall } from "@/hooks/useVideoCall";
import { NewChatDialog } from "./NewChatDialog";
import { VideoCallInvite } from "./VideoCallInvite";

export const ChatInterface = () => {
  const {
    chats,
    sendMessage,
    markAsRead,
    startCall,
    startVideo,
    createNewChat,
    getMessagesForContact,
    getStats,
    getActiveCallForContact,
    joinVideoCall,
    endVideoCall
  } = useChatManager();

  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = getStats();
  const currentMessages = selectedChat ? getMessagesForContact(selectedChat.id) : [];
  const activeCall = selectedChat ? getActiveCallForContact(selectedChat.id) : null;

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      sendMessage(selectedChat.id, newMessage.trim());
      setNewMessage("");
    }
  };

  const handleSelectChat = (chat: typeof chats[0]) => {
    setSelectedChat(chat);
    if (chat.unread > 0) {
      markAsRead(chat.id);
    }
  };

  const handleStartCall = () => {
    if (selectedChat) {
      startCall(selectedChat);
    }
  };

  const handleStartVideo = () => {
    if (selectedChat) {
      startVideo(selectedChat);
    }
  };

  const handleJoinCall = () => {
    if (activeCall) {
      joinVideoCall(activeCall.id);
    }
  };

  const handleEndCall = () => {
    if (activeCall) {
      endVideoCall(activeCall.id);
    }
  };

  const handleNewChat = (chatData: any) => {
    const newChat = createNewChat(chatData);
    setSelectedChat(newChat);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "WhatsApp": return "bg-green-100 text-green-800";
      case "Email": return "bg-blue-100 text-blue-800";
      case "Chat Site": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat & Atendimento</h1>
          <p className="text-gray-600">Central unificada de comunicação</p>
        </div>
        <NewChatDialog onCreateChat={handleNewChat} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalChats}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Lidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.unreadCount}</p>
              </div>
              <Badge className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Resposta</p>
                <p className="text-2xl font-bold text-green-600">{stats.averageResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-purple-600">{stats.satisfaction}</p>
              </div>
              <Smile className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Chat List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">Conversas</CardTitle>
              <Badge variant="secondary">{chats.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {chat.contact.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{chat.contact}</h4>
                        <p className="text-xs text-gray-500">{chat.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      {chat.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs mt-1">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {chat.lastMessage}
                    </p>
                    <Badge className={getChannelColor(chat.channel)} variant="outline">
                      {chat.channel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChat.contact.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedChat.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedChat.contact}</h3>
                      <p className="text-sm text-gray-500">{selectedChat.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={handleStartCall}>
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleStartVideo}>
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-4">
                {/* Video Call Invite */}
                {activeCall && (
                  <VideoCallInvite
                    call={activeCall}
                    contactName={selectedChat.contact}
                    onJoin={handleJoinCall}
                    onEnd={handleEndCall}
                  />
                )}

                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                  {currentMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'sent' 
                          ? 'bg-blue-600 text-white' 
                          : message.type === 'system'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.type === 'system' && (
                          <p className="text-xs font-semibold mb-1">🎥 Sistema</p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'sent' 
                            ? 'text-blue-100' 
                            : message.type === 'system'
                            ? 'text-yellow-600'
                            : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecione uma conversa para começar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
