
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  User,
  Clock
} from "lucide-react";

const mockChats = [
  {
    id: 1,
    contact: "Maria Santos",
    company: "Empresa XYZ",
    lastMessage: "Gostaria de agendar uma reunião para próxima semana",
    timestamp: "14:30",
    unread: 2,
    status: "online",
    channel: "WhatsApp"
  },
  {
    id: 2,
    contact: "João Silva",
    company: "StartupTech", 
    lastMessage: "Obrigado pelas informações, vou analisar a proposta",
    timestamp: "13:45",
    unread: 0,
    status: "offline",
    channel: "Email"
  },
  {
    id: 3,
    contact: "Ana Costa",
    company: "ABC Corp",
    lastMessage: "Podemos conversar sobre os preços?",
    timestamp: "12:20",
    unread: 1,
    status: "away",
    channel: "Chat Site"
  }
];

const mockMessages = [
  {
    id: 1,
    sender: "Maria Santos",
    message: "Olá! Estou interessada nos seus serviços de consultoria.",
    timestamp: "14:25",
    type: "received"
  },
  {
    id: 2,
    sender: "Você",
    message: "Olá Maria! Fico feliz com o seu interesse. Podemos agendar uma conversa?",
    timestamp: "14:27",
    type: "sent"
  },
  {
    id: 3,
    sender: "Maria Santos",
    message: "Gostaria de agendar uma reunião para próxima semana",
    timestamp: "14:30",
    type: "received"
  }
];

export const ChatInterface = () => {
  const [chats] = useState(mockChats);
  const [messages] = useState(mockMessages);
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log(`Enviando mensagem: ${newMessage}`);
      setNewMessage("");
    }
  };

  const handleStartCall = () => {
    console.log(`Iniciando ligação para ${selectedChat?.contact}...`);
  };

  const handleStartVideo = () => {
    console.log(`Iniciando video chamada para ${selectedChat?.contact}...`);
  };

  const handleNewChat = () => {
    console.log("Iniciando novo chat...");
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
        <Button onClick={handleNewChat} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Chat
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{chats.length}</p>
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
                <p className="text-2xl font-bold text-red-600">
                  {chats.reduce((sum, chat) => sum + chat.unread, 0)}
                </p>
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
                <p className="text-2xl font-bold text-green-600">2min</p>
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
                <p className="text-2xl font-bold text-purple-600">98%</p>
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
                  onClick={() => setSelectedChat(chat)}
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
                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'sent' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'}`}>
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
