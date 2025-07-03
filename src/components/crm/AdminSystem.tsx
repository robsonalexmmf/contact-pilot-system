
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const systemMetrics = [
  { name: "CPU", value: 45, unit: "%", status: "normal", icon: Cpu },
  { name: "Memória", value: 67, unit: "%", status: "warning", icon: Server },
  { name: "Disco", value: 23, unit: "%", status: "normal", icon: HardDrive },
  { name: "Rede", value: 89, unit: "Mbps", status: "good", icon: Wifi }
];

const services = [
  { name: "API Principal", status: "online", uptime: "99.9%", responseTime: "145ms" },
  { name: "Banco de Dados", status: "online", uptime: "99.8%", responseTime: "12ms" },
  { name: "Cache Redis", status: "online", uptime: "99.9%", responseTime: "8ms" },
  { name: "Email Service", status: "online", uptime: "98.5%", responseTime: "230ms" },
  { name: "WhatsApp API", status: "warning", uptime: "95.2%", responseTime: "1200ms" },
  { name: "File Storage", status: "online", uptime: "99.7%", responseTime: "89ms" }
];

const recentEvents = [
  { time: "14:30", type: "info", message: "Backup automático concluído com sucesso" },
  { time: "13:45", type: "warning", message: "Alto uso de CPU detectado no servidor web" },
  { time: "12:20", type: "success", message: "Atualização de segurança aplicada" },
  { time: "11:15", type: "error", message: "Falha temporária na conexão com WhatsApp API" },
  { time: "10:30", type: "info", message: "Limpeza automática de logs executada" }
];

export const AdminSystem = () => {
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

  const getProgressColor = (value: number) => {
    if (value > 80) return "bg-red-500";
    if (value > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema</h1>
          <p className="text-gray-600">Monitoramento e controle do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
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
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                  </div>
                  <span className="text-lg font-bold">{metric.value}{metric.unit}</span>
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
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
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
        <Card>
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
                <span className="text-sm font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tabelas</span>
                <span className="text-sm font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registros</span>
                <span className="text-sm font-medium">1.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Último Backup</span>
                <span className="text-sm font-medium">Hoje 02:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tempo Médio</span>
                <span className="text-sm font-medium">145ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de Erro</span>
                <span className="text-sm font-medium text-green-600">0.02%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponibilidade</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                <span className="text-sm font-medium">147 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Disponível</span>
                <span className="text-sm font-medium">353 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium">500 GB</span>
              </div>
              <Progress value={29} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
