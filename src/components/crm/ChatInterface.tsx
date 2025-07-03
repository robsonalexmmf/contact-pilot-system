
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video,
  Paperclip,
  Smile,
  Search,
  MoreHorizontal
} from "lucide-react";

const mockChats = [
  {
    id: 1,
    name: "Maria Santos",
    company: "Empresa XYZ",
    lastMessage: "Quando podemos agendar a apresentação?",
    timestamp: "14:30",
    unread: 2,
    online: true,
    avatar: "M"
  },
  {
    id: 2,
    name: "João Silva",
    company: "StartupTech",
    lastMessage: "Obrigado pelo material enviado",
    timestamp: "13:15",
    unread: 0,
    online: false,
    avatar: "J"
  },
  {
    id: 3,
    name: "Ana Costa",
    company: "Corporação ABC",
    lastMessage: "Vamos finalizar o contrato hoje",
    timestamp: "12:45",
    unread: 1,
    online: true,
    avatar: "A"
  }
];

const mockMessages = [
  {
    id: 1,
    sender: "Maria Santos",
    message: "Olá! Gostaria de saber mais sobre a solução que vocês oferecem.",
    timestamp: "14:25",
    isMe: false
  },
  {
    id: 2,
    sender: "Você",
    message: "Olá Maria! Claro, ficarei feliz em ajudar. Nossa solução é completa e pode ser personalizada para sua empresa.",
    timestamp: "14:26",
    isMe: true
  },
  {
    id: 3,
    sender: "Maria Santos",
    message: "Perfeito! Vocês têm algum material que posso analisar primeiro?",
    timestamp: "14:28",
    isMe: false
  },
  {
    id: 4,
    sender: "Você",
    message: "Sim! Vou enviar nossa apresentação comercial por e-mail. Que tal agendarmos uma reunião para esta semana?",
    timestamp: "14:29",
    isMe: true
  },
  {
    id: 5,
    sender: "Maria Santos",
    message: "Quando podemos agendar a apresentação?",
    timestamp: "14:30",
    isMe: false
  }
];

export const ChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      console.log("Enviando mensagem:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      {/* Chat List */}
      <div className="col-span-4">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversas
            </CardTitle>
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
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                    selectedChat.id === chat.id 
                      ? 'bg-blue-50 border-l-blue-500' 
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {chat.name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          {chat.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{chat.company}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages */}
      <div className="col-span-8">
        <Card className="h-full flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChat.company}</p>
                  <p className="text-xs text-green-600">
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isMe
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isMe ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Smile className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
