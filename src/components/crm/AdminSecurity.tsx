
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Lock, 
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  Key,
  UserX,
  Globe,
  Clock,
  Activity,
  Settings
} from "lucide-react";

const securityEvents = [
  {
    id: 1,
    type: "failed_login",
    user: "unknown",
    ip: "192.168.1.100",
    location: "São Paulo, BR",
    timestamp: "2024-01-15 14:30",
    status: "blocked",
    attempts: 5
  },
  {
    id: 2,
    type: "suspicious_activity",
    user: "joao@empresa.com",
    ip: "10.0.0.1",
    location: "Rio de Janeiro, BR",
    timestamp: "2024-01-15 13:45",
    status: "monitoring",
    attempts: 1
  },
  {
    id: 3,
    type: "password_change",
    user: "maria@startup.com",
    ip: "192.168.1.102",
    location: "Belo Horizonte, BR",
    timestamp: "2024-01-15 12:20",
    status: "success",
    attempts: 1
  }
];

const securitySettings = [
  { key: "two_factor", label: "Autenticação de Dois Fatores", enabled: true, description: "Obrigatória para admins" },
  { key: "ip_whitelist", label: "Lista Branca de IPs", enabled: false, description: "Restringir acesso por IP" },
  { key: "session_timeout", label: "Timeout de Sessão", enabled: true, description: "30 minutos de inatividade" },
  { key: "password_policy", label: "Política de Senhas", enabled: true, description: "Senhas fortes obrigatórias" },
  { key: "login_notifications", label: "Notificações de Login", enabled: true, description: "Email para novos logins" },
  { key: "audit_log", label: "Log de Auditoria", enabled: true, description: "Registrar todas as ações" }
];

const blockedIPs = [
  { ip: "192.168.1.100", reason: "Múltiplas tentativas de login", blockedAt: "2024-01-15 14:30", attempts: 15 },
  { ip: "10.0.0.50", reason: "Atividade suspeita", blockedAt: "2024-01-15 13:20", attempts: 8 },
  { ip: "203.0.113.1", reason: "IP conhecido malicioso", blockedAt: "2024-01-15 12:00", attempts: 23 }
];

export const AdminSecurity = () => {
  const [events] = useState(securityEvents);
  const [settings, setSettings] = useState(securitySettings);
  const [blocked] = useState(blockedIPs);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <UserX className="w-4 h-4 text-red-500" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'password_change': return <Key className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'failed_login': return 'bg-red-100 text-red-800';
      case 'suspicious_activity': return 'bg-yellow-100 text-yellow-800';
      case 'password_change': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleSetting = (key: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const failedLogins = events.filter(e => e.type === 'failed_login').length;
  const suspiciousActivity = events.filter(e => e.type === 'suspicious_activity').length;
  const blockedIPsCount = blocked.length;
  const enabledSettings = settings.filter(s => s.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segurança</h1>
          <p className="text-gray-600">Monitore e configure a segurança do sistema</p>
        </div>
        <Button className="bg-gradient-to-r from-red-600 to-orange-600">
          <Shield className="w-4 h-4 mr-2" />
          Auditoria Completa
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tentativas Falhadas</p>
                <p className="text-2xl font-bold text-red-600">{failedLogins}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Última hora</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividade Suspeita</p>
                <p className="text-2xl font-bold text-yellow-600">{suspiciousActivity}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Em monitoramento</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IPs Bloqueados</p>
                <p className="text-2xl font-bold text-red-600">{blockedIPsCount}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Total ativo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Configurações</p>
                <p className="text-2xl font-bold text-green-600">{enabledSettings}/{settings.length}</p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600">Ativas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Eventos de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg border">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Badge className={getEventColor(event.type)}>
                        {event.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium">Usuário:</span>
                        <span className="ml-1">{event.user}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        <span>{event.ip} - {event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{event.timestamp}</span>
                      </div>
                      {event.attempts > 1 && (
                        <div className="text-red-600">
                          {event.attempts} tentativas
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Configurações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.key} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{setting.label}</span>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(setting.key)}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button className="w-full">
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked IPs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            IPs Bloqueados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {blocked.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.ip}</p>
                    <p className="text-sm text-gray-600">{item.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-red-100 text-red-800 mb-1">
                    {item.attempts} tentativas
                  </Badge>
                  <p className="text-xs text-gray-500">{item.blockedAt}</p>
                </div>
                <Button size="sm" variant="outline">
                  Desbloquear
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Input placeholder="IP para bloquear manualmente" className="flex-1 mr-2" />
            <Button>Bloquear IP</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
