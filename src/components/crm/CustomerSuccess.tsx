
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Heart,
  Target,
  Calendar,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockCustomers = [
  {
    id: 1,
    name: "Empresa XYZ",
    healthScore: 85,
    nps: 9,
    lastContact: "2024-01-15",
    status: "Saudável",
    renewalDate: "2024-06-15",
    value: 15000,
    riskLevel: "Baixo"
  },
  {
    id: 2,
    name: "StartupTech",
    healthScore: 45,
    nps: 4,
    lastContact: "2024-01-10",
    status: "Em Risco",
    renewalDate: "2024-03-20",
    value: 8500,
    riskLevel: "Alto"
  }
];

const npsData = [
  { month: 'Jan', score: 7.2 },
  { month: 'Fev', score: 7.8 },
  { month: 'Mar', score: 8.1 },
  { month: 'Abr', score: 7.9 },
  { month: 'Mai', score: 8.4 },
  { month: 'Jun', score: 8.7 }
];

export const CustomerSuccess = () => {
  const [customers] = useState(mockCustomers);

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Saudável": return "bg-green-100 text-green-800";
      case "Em Risco": return "bg-red-100 text-red-800";
      case "Atenção": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NPS Médio</p>
                <p className="text-2xl font-bold text-green-600">8.7</p>
              </div>
              <Heart className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Saudáveis</p>
                <p className="text-2xl font-bold text-blue-600">85%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Risco</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renovações</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPS Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={npsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Saúde</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Saudáveis (80-100)</span>
                <span className="text-sm font-bold">1 cliente</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Atenção (60-79)</span>
                <span className="text-sm font-bold">0 clientes</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Em Risco (0-59)</span>
                <span className="text-sm font-bold">1 cliente</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes - Sucesso do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">Valor: R$ {customer.value.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                    <Badge variant="outline">
                      NPS: {customer.nps}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Health Score</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={customer.healthScore} className="flex-1 h-2" />
                      <span className={`font-bold ${getHealthColor(customer.healthScore)}`}>
                        {customer.healthScore}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Último Contato</p>
                    <p className="font-medium">{customer.lastContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Renovação</p>
                    <p className="font-medium">{customer.renewalDate}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    E-mail
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Agendar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
