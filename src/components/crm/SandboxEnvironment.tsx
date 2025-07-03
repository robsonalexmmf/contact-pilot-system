import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube, 
  Play,
  Pause,
  RotateCcw,
  Copy,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const mockTests = [
  {
    id: 1,
    name: "Automação WhatsApp - Leads Frios",
    status: "Executando",
    duration: "2h 30min",
    leads: 45,
    success: 32
  },
  {
    id: 2,
    name: "Teste Integração RD Station",
    status: "Pausado",
    duration: "45min",
    leads: 12,
    success: 10
  }
];

export const SandboxEnvironment = () => {
  const [tests] = useState(mockTests);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ambiente Sandbox</h1>
          <p className="text-gray-600">Teste automações e integrações sem afetar dados reais</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <TestTube className="w-4 h-4 mr-2" />
          Novo Teste
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Testes Ativos</p>
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
              <TestTube className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Sucesso</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Testados</p>
                <p className="text-2xl font-bold text-purple-600">157</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold text-orange-600">8h 15min</p>
              </div>
              <Settings className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Testes em Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">Duração: {test.duration}</p>
                  </div>
                  <Badge className={test.status === "Executando" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {test.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <span className="text-gray-600">Leads testados: </span>
                    <span className="font-medium">{test.leads}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sucessos: </span>
                    <span className="font-medium text-green-600">{test.success}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {test.status === "Executando" ? (
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-2" />
                      Continuar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Aplicar ao Real
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Ambiente Seguro</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Todos os testes são executados em ambiente isolado. Nenhum dado real será afetado.
                Para aplicar os resultados ao ambiente de produção, use o botão "Aplicar ao Real".
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
