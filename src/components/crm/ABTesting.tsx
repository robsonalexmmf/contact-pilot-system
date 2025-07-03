
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Play,
  Pause,
  Trophy
} from "lucide-react";

const mockTests = [
  {
    id: 1,
    name: "E-mail Follow-up vs WhatsApp",
    status: "Ativo",
    variants: [
      { name: "E-mail", participants: 150, conversions: 23, rate: 15.3 },
      { name: "WhatsApp", participants: 147, conversions: 31, rate: 21.1 }
    ],
    winner: "WhatsApp",
    confidence: 87
  },
  {
    id: 2,
    name: "Proposta Formato A vs B",
    status: "Finalizado",
    variants: [
      { name: "Formato A", participants: 89, conversions: 12, rate: 13.5 },
      { name: "Formato B", participants: 91, conversions: 19, rate: 20.9 }
    ],
    winner: "Formato B",
    confidence: 95
  }
];

export const ABTesting = () => {
  const [tests] = useState(mockTests);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Finalizado":
        return "bg-blue-100 text-blue-800";
      case "Pausado":
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
          <h1 className="text-2xl font-bold text-gray-900">Testes A/B</h1>
          <p className="text-gray-600">Otimize abordagens, propostas e campanhas com dados</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <FlaskConical className="w-4 h-4 mr-2" />
          Novo Teste A/B
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Testes Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{tests.filter(t => t.status === "Ativo").length}</p>
              </div>
              <FlaskConical className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-green-600">477</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                <p className="text-2xl font-bold text-purple-600">17.7%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Melhoria Média</p>
                <p className="text-2xl font-bold text-orange-600">+38%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Testes em Andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tests.map((test) => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.winner && (
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">Vencedor: {test.winner}</span>
                          <span className="text-sm text-gray-500">({test.confidence}% confiança)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {test.status === "Ativo" ? (
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Reativar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {test.variants.map((variant, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${variant.name === test.winner ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{variant.name}</h4>
                        {variant.name === test.winner && (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Participantes:</span>
                          <span className="font-medium">{variant.participants}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversões:</span>
                          <span className="font-medium">{variant.conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxa:</span>
                          <span className={`font-medium ${variant.name === test.winner ? 'text-green-600' : 'text-gray-900'}`}>
                            {variant.rate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${variant.name === test.winner ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(variant.rate * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Teste Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Abordagens</h3>
              <p className="text-sm text-gray-600">Teste diferentes scripts e canais de contato</p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Propostas</h3>
              <p className="text-sm text-gray-600">Compare formatos e estruturas de proposta</p>
            </div>

            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Campanhas</h3>
              <p className="text-sm text-gray-600">Otimize e-mails, landing pages e anúncios</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
