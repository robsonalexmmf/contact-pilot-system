
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  Eye,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const realtimeData = [
  { time: '14:00', users: 145, requests: 1240, errors: 2 },
  { time: '14:05', users: 152, requests: 1380, errors: 1 },
  { time: '14:10', users: 148, requests: 1290, errors: 3 },
  { time: '14:15', users: 167, requests: 1450, errors: 0 },
  { time: '14:20', users: 173, requests: 1520, errors: 1 },
  { time: '14:25', users: 169, requests: 1480, errors: 2 },
  { time: '14:30', users: 181, requests: 1600, errors: 0 }
];

const alerts = [
  { 
    id: 1, 
    type: "critical", 
    title: "Alto uso de CPU", 
    description: "CPU acima de 90% nos últimos 5 minutos",
    time: "2 min atrás",
    status: "active"
  },
  { 
    id: 2, 
    type: "warning", 
    title: "Resposta lenta da API", 
    description: "Tempo de resposta médio acima de 500ms",
    time: "8 min atrás",
    status: "active"
  },
  { 
    id: 3, 
    type: "info", 
    title: "Backup concluído", 
    description: "Backup automático executado com sucesso",
    time: "1h atrás",
    status: "resolved"
  },
  { 
    id: 4, 
    type: "error", 
    title: "Falha na integração", 
    description: "WhatsApp API indisponível temporariamente",
    time: "2h atrás",
    status: "resolved"
  }
];

const userActivity = [
  { user: "João Silva", action: "Login", time: "14:28", ip: "192.168.1.100" },
  { user: "Maria Santos", action: "Criou lead", time: "14:25", ip: "192.168.1.101" },
  { user: "Pedro Costa", action: "Enviou proposta", time: "14:22", ip: "192.168.1.102" },
  { user: "Ana Oliveira", action: "Logout", time: "14:20", ip: "192.168.1.103" },
  { user: "Carlos Lima", action: "Atualizou perfil", time: "14:18", ip: "192.168.1.104" }
];

export const AdminMonitoring = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const currentUsers = realtimeData[realtimeData.length - 1]?.users || 0;
  const currentRequests = realtimeData[realtimeData.length - 1]?.requests || 0;
  const currentErrors = realtimeData[realtimeData.length - 1]?.errors || 0;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento</h1>
          <p className="text-gray-600">Monitoramento em tempo real do sistema</p>
        </div>
        <Button size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Online</p>
                <p className="text-2xl font-bold text-blue-600">{currentUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requisições/min</p>
                <p className="text-2xl font-bold text-green-600">{currentRequests}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erros</p>
                <p className="text-2xl font-bold text-red-600">{currentErrors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Taxa: 0.01%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Ativos</p>
                <p className="text-2xl font-bold text-orange-600">{activeAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Requer atenção</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Atividade em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Usuários"
                />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Requisições"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alertas do Sistema
              </div>
              <Badge variant="destructive">{activeAlerts} ativos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{alert.title}</h4>
                        <Badge className={alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {alert.status === 'active' ? 'Ativo' : 'Resolvido'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Atividade Recente dos Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{activity.time}</p>
                  <p className="text-xs text-gray-500">{activity.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
