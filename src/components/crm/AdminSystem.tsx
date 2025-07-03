import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi,
  RefreshCw,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { useState } from "react";

interface AdminSystemProps {
  setActiveModule?: (module: string) => void;
}

export const AdminSystem = ({ setActiveModule }: AdminSystemProps) => {
  const { metrics, services, events, loading, refreshMetrics } = useSystemMetrics();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshMetrics();
    
    toast({
      title: "Sistema Atualizado",
      description: "Métricas atualizadas com sucesso!",
    });
    
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSettings = () => {
    if (setActiveModule) {
      setActiveModule('admin-settings');
      toast({
        title: "Configurações",
        description: "Abrindo configurações do sistema...",
      });
    } else {
      toast({
        title: "Configurações",
        description: "Redirecionando para configurações do sistema...",
      });
    }
  };

  const handleServiceAction = (serviceName: string) => {
    toast({
      title: `${serviceName}`,
      description: `Verificando status do serviço ${serviceName}...`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando métricas do sistema...</p>
        </div>
      </div>
    );
  }

  const systemMetrics = [
    { name: "CPU", value: metrics.cpu, unit: "%", status: metrics.cpu > 80 ? "critical" : metrics.cpu > 60 ? "warning" : "normal", icon: Cpu },
    { name: "Memória", value: metrics.memory, unit: "%", status: metrics.memory > 80 ? "critical" : metrics.memory > 60 ? "warning" : "normal", icon: Server },
    { name: "Disco", value: metrics.disk, unit: "%", status: metrics.disk > 80 ? "critical" : metrics.disk > 60 ? "warning" : "normal", icon: HardDrive },
    { name: "Rede", value: metrics.network, unit: "Mbps", status: "good", icon: Wifi }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema</h1>
          <p className="text-gray-600">Monitoramento e controle do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button size="sm" onClick={handleSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleServiceAction(metric.name)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                  </div>
                  <span className="text-lg font-bold">{Math.round(metric.value)}{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
                <div className="flex justify-between items-center mt-2">
                  <Badge className={
                    metric.status === 'normal' ? 'bg-green-100 text-green-800' :
                    metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {metric.status === 'normal' ? 'Normal' : 
                     metric.status === 'warning' ? 'Atenção' : 'Crítico'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Status dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleServiceAction(service.name)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'online' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(service.status)}>
                      {service.status === 'online' ? 'Online' : 
                       service.status === 'warning' ? 'Atenção' : 'Offline'}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{service.responseTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Eventos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.message}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleServiceAction('Banco de Dados')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Banco de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tamanho Total</span>
                <span className="text-sm font-medium">{(2.4 + Math.random() * 0.5).toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tabelas</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registros</span>
                <span className="text-sm font-medium">{Math.floor(Math.random() * 500 + 100)}k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Último Backup</span>
                <span className="text-sm font-medium">Hoje {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleServiceAction('Performance')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Req/minuto</span>
                <span className="text-sm font-medium">{Math.floor(Math.random() * 500 + 800)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo Médio</span>
                <span className="text-sm font-medium">{Math.floor(Math.random() * 50 + 100)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de Erro</span>
                <span className="text-sm font-medium text-green-600">{(Math.random() * 0.05).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponibilidade</span>
                <span className="text-sm font-medium text-green-600">{(99.5 + Math.random() * 0.4).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleServiceAction('Armazenamento')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Armazenamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Usado</span>
                <span className="text-sm font-medium">{Math.floor(100 + metrics.disk * 2)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponível</span>
                <span className="text-sm font-medium">{500 - Math.floor(100 + metrics.disk * 2)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium">500 GB</span>
              </div>
              <Progress value={metrics.disk} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
