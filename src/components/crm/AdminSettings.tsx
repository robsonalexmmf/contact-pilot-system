import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Globe, 
  Database,
  Mail,
  Shield,
  Palette,
  Bell,
  Users,
  Server,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxUsers: number;
    sessionTimeout: number;
  };
  database: {
    autoBackup: boolean;
    backupFrequency: string;
    retentionDays: number;
    compressionEnabled: boolean;
    maxConnections: number;
    queryTimeout: number;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
    fromName: string;
    encryption: string;
    enabled: boolean;
    dailyLimit: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    twoFactorRequired: boolean;
    ipWhitelist: string;
    enableAuditLog: boolean;
    passwordExpiration: number;
  };
  notifications: {
    systemAlerts: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    webhookNotifications: boolean;
    slackEnabled: boolean;
    discordEnabled: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    logoUrl: string;
    customCss: string;
    brandName: string;
    favIcon: string;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTtl: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxRequestSize: number;
    rateLimit: number;
  };
}

const defaultSettings: SystemSettings = {
  general: {
    siteName: "CRM Empresa",
    siteDescription: "Sistema de Gestão de Relacionamento com Cliente",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    maintenanceMode: false,
    registrationEnabled: true,
    maxUsers: 100,
    sessionTimeout: 30
  },
  database: {
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    compressionEnabled: true,
    maxConnections: 20,
    queryTimeout: 30
  },
  email: {
    smtpHost: "mail.empresa.com",
    smtpPort: "587",
    smtpUser: "noreply@empresa.com",
    smtpPassword: "",
    fromName: "CRM Sistema",
    encryption: "tls",
    enabled: true,
    dailyLimit: 1000
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    twoFactorRequired: false,
    ipWhitelist: "",
    enableAuditLog: true,
    passwordExpiration: 90
  },
  notifications: {
    systemAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true,
    slackEnabled: false,
    discordEnabled: false
  },
  appearance: {
    theme: "light",
    primaryColor: "#3B82F6",
    logoUrl: "",
    customCss: "",
    brandName: "CRM Sistema",
    favIcon: ""
  },
  performance: {
    cacheEnabled: true,
    cacheTtl: 3600,
    compressionEnabled: true,
    cdnEnabled: false,
    maxRequestSize: 10,
    rateLimit: 100
  }
};

export const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.9%",
    activeUsers: 0,
    totalStorage: "15.2GB",
    lastBackup: "2024-01-15 10:30:00"
  });

  // Carregar configurações ao inicializar
  useEffect(() => {
    loadSettings();
    loadSystemStatus();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Tentar carregar do localStorage primeiro
      const savedSettings = localStorage.getItem('admin_system_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        console.log('Configurações carregadas do localStorage:', parsed);
      }

      // Tentar carregar do Supabase
      const { data, error } = await supabase
        .from('system_settings' as any)
        .select('*')
        .single();

      if (data && !error) {
        const settingsData = data as any;
        if (settingsData.settings) {
          setSettings(settingsData.settings as SystemSettings);
          console.log('Configurações carregadas do Supabase:', settingsData.settings);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      // Simular carregamento de status do sistema
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, last_login')
        .gte('last_login', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      setSystemStatus(prev => ({
        ...prev,
        activeUsers: profiles?.length || 0
      }));
    } catch (error) {
      console.error('Erro ao carregar status do sistema:', error);
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
    console.log(`Configuração alterada: ${section}.${field} = ${value}`);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage
      localStorage.setItem('admin_system_settings', JSON.stringify(settings));
      
      // Tentar salvar no Supabase - usando type assertion para contornar limitações de TypeScript
      const { error } = await supabase
        .from('system_settings' as any)
        .upsert({
          id: 'main_config',
          settings: settings as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
      }

      // Aplicar configurações imediatamente
      applySettings();
      
      toast({
        title: "Configurações Salvas",
        description: "As configurações do sistema foram atualizadas com sucesso",
      });

      setHasChanges(false);
      console.log('Configurações salvas:', settings);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao Salvar",
        description: "Falha ao salvar as configurações do sistema",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySettings = () => {
    // Aplicar tema
    const root = document.documentElement;
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar cor primária
    root.style.setProperty('--primary-color', settings.appearance.primaryColor);

    // Aplicar CSS customizado
    let customStyleTag = document.getElementById('admin-custom-styles');
    if (!customStyleTag) {
      customStyleTag = document.createElement('style');
      customStyleTag.id = 'admin-custom-styles';
      document.head.appendChild(customStyleTag);
    }
    customStyleTag.textContent = settings.appearance.customCss;

    // Atualizar título da página
    document.title = settings.general.siteName;

    console.log('Configurações aplicadas ao sistema');
  };

  const handleResetSettings = () => {
    if (confirm('Deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
      setSettings(defaultSettings);
      localStorage.removeItem('admin_system_settings');
      setHasChanges(true);
      
      toast({
        title: "Configurações Restauradas",
        description: "As configurações foram restauradas para os valores padrão",
        variant: "destructive"
      });
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configurações Exportadas",
      description: "Arquivo de configurações baixado com sucesso",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        setHasChanges(true);
        
        toast({
          title: "Configurações Importadas",
          description: "Configurações carregadas do arquivo. Lembre-se de salvar.",
        });
      } catch (error) {
        toast({
          title: "Erro na Importação",
          description: "Arquivo de configurações inválido",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleTestEmail = async () => {
    if (!settings.email.enabled || !settings.email.smtpHost) {
      toast({
        title: "Configuração Incompleta",
        description: "Configure as configurações de email primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envio de email de teste
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email de Teste Enviado",
        description: `Email de teste enviado para ${settings.email.smtpUser}`,
      });
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: "Falha ao enviar email de teste",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    
    try {
      // Simular criação de backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSystemStatus(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleString('pt-BR')
      }));
      
      toast({
        title: "Backup Criado",
        description: "Backup do sistema criado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro no Backup",
        description: "Falha ao criar backup do sistema",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "Geral", icon: Settings },
    { id: "database", label: "Banco de Dados", icon: Database },
    { id: "email", label: "E-mail", icon: Mail },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "performance", label: "Performance", icon: Server }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Site</Label>
                <Input
                  value={settings.general.siteName}
                  onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                />
              </div>
              <div>
                <Label>Fuso Horário</Label>
                <Select 
                  value={settings.general.timezone}
                  onValueChange={(value) => handleInputChange('general', 'timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tóquio (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Descrição do Site</Label>
              <Textarea
                value={settings.general.siteDescription}
                onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Máximo de Usuários</Label>
                <Input
                  type="number"
                  value={settings.general.maxUsers}
                  onChange={(e) => handleInputChange('general', 'maxUsers', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Timeout de Sessão (minutos)</Label>
                <Input
                  type="number"
                  value={settings.general.sessionTimeout}
                  onChange={(e) => handleInputChange('general', 'sessionTimeout', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo de Manutenção</Label>
                <p className="text-sm text-gray-600">Desabilita o acesso ao sistema para usuários</p>
              </div>
              <Switch
                checked={settings.general.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('general', 'maintenanceMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Permitir Novos Cadastros</Label>
                <p className="text-sm text-gray-600">Permite que novos usuários se cadastrem</p>
              </div>
              <Switch
                checked={settings.general.registrationEnabled}
                onCheckedChange={(checked) => handleInputChange('general', 'registrationEnabled', checked)}
              />
            </div>
          </div>
        );

      case "database":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-600">Realizar backup automático do banco de dados</p>
              </div>
              <Switch
                checked={settings.database.autoBackup}
                onCheckedChange={(checked) => handleInputChange('database', 'autoBackup', checked)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Frequência do Backup</Label>
                <Select 
                  value={settings.database.backupFrequency}
                  onValueChange={(value) => handleInputChange('database', 'backupFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retenção (dias)</Label>
                <Input
                  type="number"
                  value={settings.database.retentionDays}
                  onChange={(e) => handleInputChange('database', 'retentionDays', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Máximo de Conexões</Label>
                <Input
                  type="number"
                  value={settings.database.maxConnections}
                  onChange={(e) => handleInputChange('database', 'maxConnections', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Timeout de Query (segundos)</Label>
                <Input
                  type="number"
                  value={settings.database.queryTimeout}
                  onChange={(e) => handleInputChange('database', 'queryTimeout', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Compressão de Backup</Label>
                <p className="text-sm text-gray-600">Comprimir arquivos de backup para economizar espaço</p>
              </div>
              <Switch
                checked={settings.database.compressionEnabled}
                onCheckedChange={(checked) => handleInputChange('database', 'compressionEnabled', checked)}
              />
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleCreateBackup} disabled={isLoading}>
                <Database className="w-4 h-4 mr-2" />
                {isLoading ? "Criando Backup..." : "Criar Backup Agora"}
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Último backup: {systemStatus.lastBackup}
              </p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Habilitar E-mail</Label>
                <p className="text-sm text-gray-600">Ativar sistema de e-mail</p>
              </div>
              <Switch
                checked={settings.email.enabled}
                onCheckedChange={(checked) => handleInputChange('email', 'enabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Servidor SMTP</Label>
                <Input
                  value={settings.email.smtpHost}
                  onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                  disabled={!settings.email.enabled}
                />
              </div>
              <div>
                <Label>Porta SMTP</Label>
                <Input
                  value={settings.email.smtpPort}
                  onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                  disabled={!settings.email.enabled}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usuário SMTP</Label>
                <Input
                  value={settings.email.smtpUser}
                  onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                  disabled={!settings.email.enabled}
                />
              </div>
              <div>
                <Label>Senha SMTP</Label>
                <Input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                  disabled={!settings.email.enabled}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Remetente</Label>
                <Input
                  value={settings.email.fromName}
                  onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                  disabled={!settings.email.enabled}
                />
              </div>
              <div>
                <Label>Criptografia</Label>
                <Select 
                  value={settings.email.encryption}
                  onValueChange={(value) => handleInputChange('email', 'encryption', value)}
                  disabled={!settings.email.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Limite Diário de E-mails</Label>
              <Input
                type="number"
                value={settings.email.dailyLimit}
                onChange={(e) => handleInputChange('email', 'dailyLimit', parseInt(e.target.value) || 0)}
                disabled={!settings.email.enabled}
              />
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleTestEmail} disabled={isLoading || !settings.email.enabled}>
                <Mail className="w-4 h-4 mr-2" />
                {isLoading ? "Enviando..." : "Testar Configuração"}
              </Button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Timeout de Sessão (minutos)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Máximo de Tentativas de Login</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tamanho Mínimo da Senha</Label>
                <Input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Expiração da Senha (dias)</Label>
                <Input
                  type="number"
                  value={settings.security.passwordExpiration}
                  onChange={(e) => handleInputChange('security', 'passwordExpiration', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Caracteres Especiais Obrigatórios</Label>
                <p className="text-sm text-gray-600">Exigir caracteres especiais nas senhas</p>
              </div>
              <Switch
                checked={settings.security.requireSpecialChars}
                onCheckedChange={(checked) => handleInputChange('security', 'requireSpecialChars', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticação de Dois Fatores Obrigatória</Label>
                <p className="text-sm text-gray-600">Exigir 2FA para todos os usuários</p>
              </div>
              <Switch
                checked={settings.security.twoFactorRequired}
                onCheckedChange={(checked) => handleInputChange('security', 'twoFactorRequired', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Log de Auditoria</Label>
                <p className="text-sm text-gray-600">Registrar todas as ações do sistema</p>
              </div>
              <Switch
                checked={settings.security.enableAuditLog}
                onCheckedChange={(checked) => handleInputChange('security', 'enableAuditLog', checked)}
              />
            </div>
            
            <div>
              <Label>Lista Branca de IPs</Label>
              <Textarea
                value={settings.security.ipWhitelist}
                onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
                placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                rows={3}
              />
              <p className="text-sm text-gray-600 mt-1">Um IP ou range por linha (deixe vazio para permitir todos)</p>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas do Sistema</Label>
                <p className="text-sm text-gray-600">Notificações sobre status do sistema</p>
              </div>
              <Switch
                checked={settings.notifications.systemAlerts}
                onCheckedChange={(checked) => handleInputChange('notifications', 'systemAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-gray-600">Enviar notificações por e-mail</p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por SMS</Label>
                <p className="text-sm text-gray-600">Enviar notificações por SMS</p>
              </div>
              <Switch
                checked={settings.notifications.smsNotifications}
                onCheckedChange={(checked) => handleInputChange('notifications', 'smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Webhooks de Notificação</Label>
                <p className="text-sm text-gray-600">Enviar notificações via webhook</p>
              </div>
              <Switch
                checked={settings.notifications.webhookNotifications}
                onCheckedChange={(checked) => handleInputChange('notifications', 'webhookNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Integração com Slack</Label>
                <p className="text-sm text-gray-600">Enviar notificações para o Slack</p>
              </div>
              <Switch
                checked={settings.notifications.slackEnabled}
                onCheckedChange={(checked) => handleInputChange('notifications', 'slackEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Integração com Discord</Label>
                <p className="text-sm text-gray-600">Enviar notificações para o Discord</p>
              </div>
              <Switch
                checked={settings.notifications.discordEnabled}
                onCheckedChange={(checked) => handleInputChange('notifications', 'discordEnabled', checked)}
              />
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tema</Label>
                <Select 
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleInputChange('appearance', 'theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cor Primária</Label>
                <Input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome da Marca</Label>
                <Input
                  value={settings.appearance.brandName}
                  onChange={(e) => handleInputChange('appearance', 'brandName', e.target.value)}
                />
              </div>
              <div>
                <Label>URL do Favicon</Label>
                <Input
                  value={settings.appearance.favIcon}
                  onChange={(e) => handleInputChange('appearance', 'favIcon', e.target.value)}
                  placeholder="https://exemplo.com/favicon.ico"
                />
              </div>
            </div>
            
            <div>
              <Label>URL do Logo</Label>
              <Input
                value={settings.appearance.logoUrl}
                onChange={(e) => handleInputChange('appearance', 'logoUrl', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
            
            <div>
              <Label>CSS Personalizado</Label>
              <Textarea
                value={settings.appearance.customCss}
                onChange={(e) => handleInputChange('appearance', 'customCss', e.target.value)}
                placeholder="/* CSS personalizado aqui */"
                rows={6}
              />
            </div>
          </div>
        );

      case "performance":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Cache Habilitado</Label>
                <p className="text-sm text-gray-600">Habilitar cache do sistema</p>
              </div>
              <Switch
                checked={settings.performance.cacheEnabled}
                onCheckedChange={(checked) => handleInputChange('performance', 'cacheEnabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>TTL do Cache (segundos)</Label>
                <Input
                  type="number"
                  value={settings.performance.cacheTtl}
                  onChange={(e) => handleInputChange('performance', 'cacheTtl', parseInt(e.target.value) || 0)}
                  disabled={!settings.performance.cacheEnabled}
                />
              </div>
              <div>
                <Label>Limite de Taxa (req/min)</Label>
                <Input
                  type="number"
                  value={settings.performance.rateLimit}
                  onChange={(e) => handleInputChange('performance', 'rateLimit', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label>Tamanho Máximo de Requisição (MB)</Label>
              <Input
                type="number"
                value={settings.performance.maxRequestSize}
                onChange={(e) => handleInputChange('performance', 'maxRequestSize', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Compressão Habilitada</Label>
                <p className="text-sm text-gray-600">Comprimir respostas HTTP</p>
              </div>
              <Switch
                checked={settings.performance.compressionEnabled}
                onCheckedChange={(checked) => handleInputChange('performance', 'compressionEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>CDN Habilitado</Label>
                <p className="text-sm text-gray-600">Usar CDN para assets estáticos</p>
              </div>
              <Switch
                checked={settings.performance.cdnEnabled}
                onCheckedChange={(checked) => handleInputChange('performance', 'cdnEnabled', checked)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && !hasChanges) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Configure parâmetros globais do sistema</p>
        </div>
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
            id="import-settings"
          />
          <label htmlFor="import-settings">
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </span>
            </Button>
          </label>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={!hasChanges || isLoading}
            className={hasChanges ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>

      {/* Status do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemStatus.uptime}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{systemStatus.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                <p className="text-2xl font-bold text-purple-600">{systemStatus.totalStorage}</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Último Backup</p>
                <p className="text-sm font-bold text-orange-600">{systemStatus.lastBackup}</p>
              </div>
              <Server className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                Você tem alterações não salvas. Lembre-se de salvar as configurações.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {settings.general.maintenanceMode && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">
                <strong>Modo de Manutenção Ativo:</strong> O sistema está bloqueado para usuários.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-5 h-5 mr-2" })
                )}
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
