
import { useState } from "react";
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
  RefreshCw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const systemSettings = {
  general: {
    siteName: "CRM Empresa",
    siteDescription: "Sistema de Gestão de Relacionamento com Cliente",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    maintenanceMode: false,
    registrationEnabled: true
  },
  database: {
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    compressionEnabled: true
  },
  email: {
    smtpHost: "mail.empresa.com",
    smtpPort: "587",
    smtpUser: "noreply@empresa.com",
    smtpPassword: "",
    fromName: "CRM Sistema",
    encryption: "tls"
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    twoFactorRequired: false,
    ipWhitelist: ""
  },
  notifications: {
    systemAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    webhookNotifications: true
  },
  appearance: {
    theme: "light",
    primaryColor: "#3B82F6",
    logoUrl: "",
    customCss: ""
  }
};

export const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(systemSettings);
  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Salvar configurações no localStorage
    localStorage.setItem('admin_system_settings', JSON.stringify(settings));
    
    toast({
      title: "Configurações Salvas",
      description: "As configurações do sistema foram atualizadas com sucesso",
    });

    console.log('Configurações do sistema salvas:', settings);
  };

  const handleResetSettings = () => {
    if (confirm('Deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
      setSettings(systemSettings);
      localStorage.removeItem('admin_system_settings');
      
      toast({
        title: "Configurações Restauradas",
        description: "As configurações foram restauradas para os valores padrão",
        variant: "destructive"
      });
    }
  };

  const tabs = [
    { id: "general", label: "Geral", icon: Settings },
    { id: "database", label: "Banco de Dados", icon: Database },
    { id: "email", label: "E-mail", icon: Mail },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette }
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
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Retenção (dias)</Label>
                <Input
                  type="number"
                  value={settings.database.retentionDays}
                  onChange={(e) => handleInputChange('database', 'retentionDays', parseInt(e.target.value))}
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
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Servidor SMTP</Label>
                <Input
                  value={settings.email.smtpHost}
                  onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                />
              </div>
              <div>
                <Label>Porta SMTP</Label>
                <Input
                  value={settings.email.smtpPort}
                  onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usuário SMTP</Label>
                <Input
                  value={settings.email.smtpUser}
                  onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                />
              </div>
              <div>
                <Label>Senha SMTP</Label>
                <Input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Remetente</Label>
                <Input
                  value={settings.email.fromName}
                  onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                />
              </div>
              <div>
                <Label>Criptografia</Label>
                <Select 
                  value={settings.email.encryption}
                  onValueChange={(value) => handleInputChange('email', 'encryption', value)}
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
                  onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Máximo de Tentativas de Login</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tamanho Mínimo da Senha</Label>
                <Input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Caracteres Especiais Obrigatórios</Label>
                </div>
                <Switch
                  checked={settings.security.requireSpecialChars}
                  onCheckedChange={(checked) => handleInputChange('security', 'requireSpecialChars', checked)}
                />
              </div>
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

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Configure parâmetros globais do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

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
              <CardTitle>
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
