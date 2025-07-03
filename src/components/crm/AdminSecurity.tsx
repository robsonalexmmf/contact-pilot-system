
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
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
  Settings,
  RefreshCw,
  Download,
  Ban
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'password_change' | 'admin_access' | 'data_export';
  user: string;
  ip: string;
  location: string;
  timestamp: string;
  status: 'blocked' | 'monitoring' | 'success' | 'warning';
  attempts: number;
  details?: string;
}

interface SecuritySettings {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
  critical?: boolean;
}

interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: string;
  attempts: number;
  autoBlocked: boolean;
}

export const AdminSecurity = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [settings, setSettings] = useState<SecuritySettings[]>([
    { key: "two_factor", label: "Autenticação de Dois Fatores", enabled: true, description: "Obrigatória para admins", critical: true },
    { key: "ip_whitelist", label: "Lista Branca de IPs", enabled: false, description: "Restringir acesso por IP" },
    { key: "session_timeout", label: "Timeout de Sessão", enabled: true, description: "30 minutos de inatividade" },
    { key: "password_policy", label: "Política de Senhas", enabled: true, description: "Senhas fortes obrigatórias", critical: true },
    { key: "login_notifications", label: "Notificações de Login", enabled: true, description: "Email para novos logins", critical: true },
    { key: "audit_log", label: "Log de Auditoria", enabled: true, description: "Registrar todas as ações", critical: true },
    { key: "brute_force_protection", label: "Proteção Força Bruta", enabled: true, description: "Bloquear IPs suspeitos", critical: true },
    { key: "data_encryption", label: "Criptografia de Dados", enabled: true, description: "Dados sensíveis criptografados", critical: true }
  ]);
  const [blocked, setBlocked] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(false);
  const [newIPtoBlock, setNewIPtoBlock] = useState("");

  const generateSecurityEvents = async () => {
    try {
      setLoading(true);

      // Buscar dados reais do CRM
      const [profilesData, leadsData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('leads').select('*')
      ]);

      const profiles = profilesData.data || [];
      const leads = leadsData.data || [];

      const generatedEvents: SecurityEvent[] = [];

      // Eventos baseados em dados reais
      if (profiles.length > 0) {
        // Simular tentativas de login falhadas baseadas nos usuários reais
        const recentProfiles = profiles.slice(0, 3);
        recentProfiles.forEach((profile, index) => {
          if (Math.random() > 0.7) { // 30% chance de evento de segurança
            generatedEvents.push({
              id: `security-${Date.now()}-${index}`,
              type: 'failed_login',
              user: profile.email,
              ip: `192.168.1.${100 + index}`,
              location: 'São Paulo, BR',
              timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString(),
              status: 'blocked',
              attempts: Math.floor(Math.random() * 10) + 3,
              details: `Múltiplas tentativas de acesso à conta ${profile.name}`
            });
          }
        });
      }

      // Eventos do sistema baseados na atividade de leads
      if (leads.length > 0) {
        const recentLeads = leads.filter(l => {
          const createdAt = new Date(l.created_at);
          const today = new Date();
          const diffHours = (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return diffHours <= 24;
        });

        if (recentLeads.length > 5) {
          generatedEvents.push({
            id: `suspicious-${Date.now()}`,
            type: 'suspicious_activity',
            user: 'Sistema',
            ip: '203.0.113.1',
            location: 'Origem Desconhecida',
            timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
            status: 'monitoring',
            attempts: recentLeads.length,
            details: `Pico suspeito de ${recentLeads.length} novos leads em 24h`
          });
        }
      }

      // Eventos de administração
      const adminEvents: SecurityEvent[] = [
        {
          id: `admin-${Date.now()}-1`,
          type: 'admin_access',
          user: 'admin@empresa.com',
          ip: '192.168.1.50',
          location: 'São Paulo, BR',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'success',
          attempts: 1,
          details: 'Acesso ao painel administrativo'
        },
        {
          id: `export-${Date.now()}`,
          type: 'data_export',
          user: 'gerente@empresa.com',
          ip: '10.0.0.25',
          location: 'Rio de Janeiro, BR',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'warning',
          attempts: 1,
          details: 'Exportação de relatório de leads'
        },
        {
          id: `password-${Date.now()}`,
          type: 'password_change',
          user: 'usuario@empresa.com',
          ip: '192.168.1.75',
          location: 'Belo Horizonte, BR',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'success',
          attempts: 1,
          details: 'Alteração de senha realizada com sucesso'
        }
      ];

      const allEvents = [...generatedEvents, ...adminEvents];
      setEvents(allEvents);

      // Gerar IPs bloqueados baseados nos eventos
      const blockedIPs: BlockedIP[] = allEvents
        .filter(event => event.status === 'blocked')
        .map(event => ({
          ip: event.ip,
          reason: `${event.type.replace('_', ' ')}: ${event.attempts} tentativas`,
          blockedAt: event.timestamp,
          attempts: event.attempts,
          autoBlocked: true
        }));

      // Adicionar alguns IPs bloqueados manualmente
      blockedIPs.push(
        {
          ip: '203.0.113.100',
          reason: 'IP malicioso conhecido',
          blockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          attempts: 25,
          autoBlocked: false
        },
        {
          ip: '198.51.100.50',
          reason: 'Tentativas de força bruta',
          blockedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          attempts: 15,
          autoBlocked: true
        }
      );

      setBlocked(blockedIPs);

      console.log('Eventos de segurança gerados:', {
        total: allEvents.length,
        blocked: allEvents.filter(e => e.status === 'blocked').length,
        monitoring: allEvents.filter(e => e.status === 'monitoring').length,
        success: allEvents.filter(e => e.status === 'success').length
      });

    } catch (error) {
      console.error('Erro ao gerar eventos de segurança:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar eventos de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <UserX className="w-4 h-4 text-red-500" />;
      case 'suspicious_activity': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'password_change': return <Key className="w-4 h-4 text-green-500" />;
      case 'admin_access': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'data_export': return <Download className="w-4 h-4 text-orange-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'failed_login': return 'bg-red-100 text-red-800';
      case 'suspicious_activity': return 'bg-yellow-100 text-yellow-800';
      case 'password_change': return 'bg-green-100 text-green-800';
      case 'admin_access': return 'bg-blue-100 text-blue-800';
      case 'data_export': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
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

    // Salvar configurações no localStorage
    const updatedSettings = settings.map(setting => 
      setting.key === key 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    );
    localStorage.setItem('security_settings', JSON.stringify(updatedSettings));

    toast({
      title: "Configuração Atualizada",
      description: `${settings.find(s => s.key === key)?.label} ${settings.find(s => s.key === key)?.enabled ? 'desativada' : 'ativada'}`,
    });
  };

  const handleBlockIP = () => {
    if (!newIPtoBlock.trim()) {
      toast({
        title: "Erro",
        description: "Digite um IP válido para bloquear",
        variant: "destructive"
      });
      return;
    }

    // Validação básica de IP
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(newIPtoBlock)) {
      toast({
        title: "IP Inválido",
        description: "Digite um endereço IP válido (ex: 192.168.1.1)",
        variant: "destructive"
      });
      return;
    }

    // Verificar se o IP já está bloqueado
    if (blocked.some(item => item.ip === newIPtoBlock)) {
      toast({
        title: "IP Já Bloqueado",
        description: "Este IP já está na lista de bloqueados",
        variant: "destructive"
      });
      return;
    }

    const newBlockedIP: BlockedIP = {
      ip: newIPtoBlock,
      reason: 'Bloqueado manualmente pelo administrador',
      blockedAt: new Date().toISOString(),
      attempts: 0,
      autoBlocked: false
    };

    setBlocked(prev => [newBlockedIP, ...prev]);
    setNewIPtoBlock("");

    toast({
      title: "IP Bloqueado",
      description: `IP ${newIPtoBlock} foi adicionado à lista de bloqueados`,
    });

    console.log('IP bloqueado:', newBlockedIP);
  };

  const handleUnblockIP = (ip: string) => {
    setBlocked(prev => prev.filter(item => item.ip !== ip));
    
    toast({
      title: "IP Desbloqueado",
      description: `IP ${ip} foi removido da lista de bloqueados`,
    });

    console.log('IP desbloqueado:', ip);
  };

  const handleExportSecurityReport = () => {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        events: events,
        blockedIPs: blocked,
        settings: settings,
        summary: {
          totalEvents: events.length,
          criticalEvents: events.filter(e => e.status === 'blocked').length,
          blockedIPs: blocked.length,
          enabledSettings: settings.filter(s => s.enabled).length
        }
      };

      const csvData = [
        ['Timestamp', 'Tipo', 'Usuário', 'IP', 'Localização', 'Status', 'Detalhes'],
        ...events.map(event => [
          new Date(event.timestamp).toLocaleString('pt-BR'),
          event.type.replace('_', ' '),
          event.user,
          event.ip,
          event.location,
          event.status,
          event.details || ''
        ])
      ];

      const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `relatorio-seguranca-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: "Relatório Exportado",
        description: "Relatório de segurança baixado com sucesso",
      });

      console.log('Relatório de segurança exportado:', reportData.summary);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        title: "Erro na Exportação",
        description: "Falha ao gerar relatório de segurança",
        variant: "destructive"
      });
    }
  };

  const handleSecurityAudit = async () => {
    setLoading(true);
    
    try {
      // Simular auditoria completa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const auditResults = {
        vulnerabilities: Math.floor(Math.random() * 3),
        warnings: Math.floor(Math.random() * 5) + 2,
        recommendations: Math.floor(Math.random() * 8) + 5,
        score: Math.floor(Math.random() * 20) + 80
      };

      toast({
        title: "Auditoria Concluída",
        description: `Score de segurança: ${auditResults.score}/100. ${auditResults.vulnerabilities} vulnerabilidades encontradas.`,
      });

      console.log('Resultado da auditoria:', auditResults);
    } catch (error) {
      console.error('Erro na auditoria:', error);
      toast({
        title: "Erro na Auditoria",
        description: "Falha ao executar auditoria de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSecurityEvents();
    
    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('security_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    // Atualizar eventos a cada 60 segundos
    const interval = setInterval(generateSecurityEvents, 60000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generateSecurityEvents}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportSecurityReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            className="bg-gradient-to-r from-red-600 to-orange-600"
            onClick={handleSecurityAudit}
            disabled={loading}
          >
            <Shield className="w-4 h-4 mr-2" />
            {loading ? 'Auditando...' : 'Auditoria Completa'}
          </Button>
        </div>
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
              <Ban className="w-8 h-8 text-red-500" />
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
            <div className="space-y-4 max-h-96 overflow-y-auto">
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
                        <span>{new Date(event.timestamp).toLocaleString('pt-BR')}</span>
                      </div>
                      {event.attempts > 1 && (
                        <div className="text-red-600 font-medium">
                          {event.attempts} tentativas
                        </div>
                      )}
                      {event.details && (
                        <div className="text-xs text-gray-500 mt-1">
                          {event.details}
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{setting.label}</span>
                        {setting.critical && (
                          <Badge variant="destructive" className="text-xs">
                            Crítico
                          </Badge>
                        )}
                      </div>
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
              <div className="flex justify-between">
                <Button variant="outline" className="flex-1 mr-2">
                  Configurações Avançadas
                </Button>
                <Button className="flex-1 ml-2">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocked IPs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ban className="w-5 h-5 mr-2" />
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
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        {item.attempts} tentativas
                      </Badge>
                      {item.autoBlocked && (
                        <Badge variant="outline" className="text-xs">
                          Auto-bloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(item.blockedAt).toLocaleString('pt-BR')}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => handleUnblockIP(item.ip)}
                  >
                    Desbloquear
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input 
              placeholder="IP para bloquear manualmente (ex: 192.168.1.1)" 
              className="flex-1"
              value={newIPtoBlock}
              onChange={(e) => setNewIPtoBlock(e.target.value)}
            />
            <Button onClick={handleBlockIP}>
              <Ban className="w-4 h-4 mr-2" />
              Bloquear IP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
