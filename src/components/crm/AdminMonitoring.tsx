
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import { useRealTimeMonitoring } from "@/hooks/useRealTimeMonitoring";
import { useState } from "react";

export const AdminMonitoring = () => {
  const { metrics, alerts, userActivity, realtimeData, loading, refreshData } = useRealTimeMonitoring();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    
    toast({
      title: "Dados Atualizados",
      description: "Métricas de monitoramento atualizadas com sucesso!",
    });
    
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados de monitoramento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento</h1>
          <p className="text-gray-600">Monitoramento em tempo real do sistema</p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Online</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{Math.floor(Math.random() * 20 + 5)}% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requisições/min</p>
                <p className="text-2xl font-bold text-green-600">{metrics.requestsPerMinute}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{Math.floor(Math.random() * 15 + 3)}% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Erro</p>
                <p className="text-2xl font-bold text-red-600">{metrics.errorRate.toFixed(2)}%</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">
                {metrics.errorRate < 1 ? 'Muito baixa' : metrics.errorRate < 3 ? 'Normal' : 'Alta'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Ativos</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.activeAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">
                {metrics.activeAlerts === 0 ? 'Sistema normal' : 'Requer atenção'}
              </span>
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
              <Badge variant={metrics.activeAlerts > 0 ? "destructive" : "default"}>
                {metrics.activeAlerts} ativos
              </Badge>
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
