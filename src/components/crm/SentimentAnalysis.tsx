
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell
} from "lucide-react";

const mockAnalysis = [
  {
    id: 1,
    type: "WhatsApp",
    contact: "Maria Silva",
    message: "Estou muito insatisfeita com o serviço. Preciso cancelar urgente!",
    sentiment: "Negativo",
    score: -0.8,
    priority: "Alta",
    timestamp: "2024-01-15 14:30"
  },
  {
    id: 2,
    type: "E-mail",
    contact: "João Santos",
    message: "Gostei muito da proposta, quando podemos conversar?",
    sentiment: "Positivo",
    score: 0.7,
    priority: "Média",
    timestamp: "2024-01-15 13:45"
  },
  {
    id: 3,
    type: "Ticket",
    contact: "Ana Costa",
    message: "Preciso de ajuda com a configuração do sistema",
    sentiment: "Neutro",
    score: 0.1,
    priority: "Baixa",
    timestamp: "2024-01-15 12:20"
  }
];

export const SentimentAnalysis = () => {
  const [analysis] = useState(mockAnalysis);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "Positivo":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "Negativo":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positivo":
        return "bg-green-100 text-green-800";
      case "Negativo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise de Sentimento</h1>
          <p className="text-gray-600">IA detecta emoções em conversas e alertas</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Brain className="w-4 h-4 mr-2" />
          Configurar IA
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversas Analisadas</p>
                <p className="text-2xl font-bold text-blue-600">234</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sentimento Positivo</p>
                <p className="text-2xl font-bold text-green-600">67%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Críticos</p>
                <p className="text-2xl font-bold text-red-600">5</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precisão IA</p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Análises Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    {getSentimentIcon(item.sentiment)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.contact}</h3>
                      <p className="text-sm text-gray-600">{item.type} • {item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getSentimentColor(item.sentiment)}>
                      {item.sentiment}
                    </Badge>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 p-3 bg-gray-50 rounded">
                  {item.message}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600">Score: </span>
                    <span className={`font-medium ${item.score > 0 ? 'text-green-600' : item.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {item.score > 0 ? '+' : ''}{item.score}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Criar Alerta
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sensibilidade</h4>
              <p className="text-sm text-gray-600 mb-3">Ajuste como a IA detecta emoções</p>
              <Button size="sm" variant="outline">Configurar</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Alertas Automáticos</h4>
              <p className="text-sm text-gray-600 mb-3">Quando notificar a equipe</p>
              <Button size="sm" variant="outline">Configurar</Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Idiomas</h4>
              <p className="text-sm text-gray-600 mb-3">PT, EN, ES suportados</p>
              <Button size="sm" variant="outline">Configurar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
