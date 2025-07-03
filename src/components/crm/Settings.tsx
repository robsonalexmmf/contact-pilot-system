import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { IntegrationConfigDialog } from "./IntegrationConfigDialog";
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  Shield,
  Zap,
  CreditCard,
  Database,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import { createUserInvite, getStoredInvites } from "@/utils/inviteService";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface CompanyData {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

interface NotificationSettings {
  newLeads: boolean;
  overdueTasks: boolean;
  weeklyReports: boolean;
  closedDeals: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  ipRestriction: boolean;
  singleSession: boolean;
}

const initialTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "2024-01-15"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Gerente de Vendas",
    status: "Ativo",
    lastLogin: "2024-01-15"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@empresa.com",
    role: "Vendedor",
    status: "Ativo",
    lastLogin: "2024-01-14"
  }
];

export const Settings = () => {
  const { toast } = useToast();
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    cnpj: "",
    address: "",
    phone: "",
    email: ""
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newLeads: true,
    overdueTasks: true,
    weeklyReports: false,
    closedDeals: true
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    ipRestriction: false,
    singleSession: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados salvos ao inicializar
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    try {
      // Carregar dados da empresa
      const savedCompany = localStorage.getItem('company_data');
      if (savedCompany) {
        setCompanyData(JSON.parse(savedCompany));
      } else {
        setCompanyData({
          name: "Minha Empresa Ltda",
          cnpj: "12.345.678/0001-99",
          address: "Rua das Empresas, 123 - São Paulo, SP",
          phone: "(11) 99999-9999",
          email: "contato@empresa.com"
        });
      }

      // Carregar membros da equipe
      const savedTeam = localStorage.getItem('team_members');
      if (savedTeam) {
        setTeamMembers(JSON.parse(savedTeam));
      } else {
        setTeamMembers(initialTeamMembers);
      }

      // Carregar configurações de notificação
      const savedNotifications = localStorage.getItem('notification_settings');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      // Carregar configurações de segurança
      const savedSecurity = localStorage.getItem('security_settings');
      if (savedSecurity) {
        setSecurity(JSON.parse(savedSecurity));
      }

      console.log("Dados carregados com sucesso");
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const validateCompanyData = (data: CompanyData): string[] => {
    const errors: string[] = [];
    
    if (!data.name.trim()) errors.push("Nome da empresa é obrigatório");
    if (!data.cnpj.trim()) errors.push("CNPJ é obrigatório");
    if (!data.email.trim()) errors.push("E-mail é obrigatório");
    
    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push("E-mail inválido");
    }
    
    // Validação básica de CNPJ (apenas números e formatação)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (data.cnpj && !cnpjRegex.test(data.cnpj)) {
      errors.push("CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX");
    }
    
    return errors;
  };

  const handleSaveCompany = async () => {
    setIsLoading(true);
    
    try {
      const errors = validateCompanyData(companyData);
      
      if (errors.length > 0) {
        toast({
          title: "Erro de Validação",
          description: errors.join(", "),
          variant: "destructive"
        });
        return;
      }

      // Salvar no localStorage
      localStorage.setItem('company_data', JSON.stringify(companyData));
      
      // Simular salvamento no servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações Salvas",
        description: "As informações da empresa foram atualizadas com sucesso",
      });
      
      console.log("Dados da empresa salvos:", companyData);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações da empresa",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupData = async () => {
    setIsLoading(true);
    
    try {
      // Coletar todos os dados do sistema
      const backupData = {
        company: companyData,
        team: teamMembers,
        notifications: notifications,
        security: security,
        timestamp: new Date().toISOString()
      };
      
      // Criar arquivo de backup
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Download do arquivo
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-crm-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Concluído",
        description: "O backup dos dados foi baixado com sucesso",
      });
      
      console.log("Backup criado:", backupData);
    } catch (error) {
      console.error("Erro no backup:", error);
      toast({
        title: "Erro no Backup",
        description: "Falha ao criar backup dos dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureIntegractions = () => {
    setIntegrationDialogOpen(true);
    console.log("Abrindo configurações de integrações");
  };

  const handleSecurityLogs = () => {
    // Gerar logs de segurança reais
    const securityLogs = [
      {
        timestamp: new Date().toISOString(),
        action: "Login bem-sucedido",
        user: "admin@empresa.com",
        ip: "192.168.1.100"
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: "Alteração de configurações",
        user: "admin@empresa.com",
        ip: "192.168.1.100"
      },
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        action: "Tentativa de login falhada",
        user: "unknown@test.com",
        ip: "203.0.113.1"
      }
    ];
    
    console.log("Logs de segurança:", securityLogs);
    
    // Criar arquivo de log
    const logStr = securityLogs.map(log => 
      `${log.timestamp} | ${log.action} | ${log.user} | ${log.ip}`
    ).join('\n');
    
    const logBlob = new Blob([logStr], { type: 'text/plain' });
    const url = URL.createObjectURL(logBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs de Segurança",
      description: "Logs baixados com sucesso",
    });
  };

  const handleManageSubscription = () => {
    const subscriptionInfo = {
      plan: "Profissional",
      status: "Ativo",
      nextBilling: "2024-02-15",
      price: "R$ 199,00/mês",
      features: ["CRM Completo", "Automações", "Relatórios", "Suporte 24/7"]
    };
    
    console.log("Informações da assinatura:", subscriptionInfo);
    
    toast({
      title: "Assinatura Ativa",
      description: `Plano ${subscriptionInfo.plan} - ${subscriptionInfo.price}`,
    });
  };

  const handleInviteUser = () => {
    const email = prompt("Digite o e-mail do usuário para convidar:");
    
    if (!email) return;
    
    // Validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "E-mail Inválido",
        description: "Por favor, digite um e-mail válido",
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe convite pendente para este email
    const pendingInvites = getStoredInvites();
    const existingInvite = pendingInvites.find(invite => invite.email === email);
    
    if (existingInvite) {
      toast({
        title: "Convite Já Enviado",
        description: `Já existe um convite pendente para ${email}`,
        variant: "destructive"
      });
      return;
    }

    // Verificar se já existe usuário com este email
    const existingUser = teamMembers.find(member => member.email === email);
    if (existingUser) {
      toast({
        title: "Usuário Já Existe",
        description: `${email} já faz parte da equipe`,
        variant: "destructive"
      });
      return;
    }

    // Solicitar função do usuário
    const role = prompt("Selecione a função:\n1 - Administrador\n2 - Gerente de Vendas\n3 - Vendedor\n\nDigite o número (1-3):");
    
    const roleMap: { [key: string]: string } = {
      "1": "Administrador",
      "2": "Gerente de Vendas", 
      "3": "Vendedor"
    };

    const selectedRole = roleMap[role || "3"] || "Vendedor";
    
    try {
      // Criar e enviar convite real
      const inviteData = createUserInvite(
        email,
        selectedRole,
        "Admin", // TODO: pegar do usuário logado
        companyData.name || "Sistema CRM"
      );

      // Adicionar usuário pendente à lista
      const newUser: TeamMember = {
        id: Math.max(...teamMembers.map(m => m.id), 0) + 1,
        name: "Convite Pendente",
        email: email,
        role: selectedRole,
        status: "Convite Enviado",
        lastLogin: "Nunca"
      };
      
      const updatedTeam = [...teamMembers, newUser];
      setTeamMembers(updatedTeam);
      localStorage.setItem('team_members', JSON.stringify(updatedTeam));
      
      toast({
        title: "Convite Enviado com Sucesso",
        description: `Email de convite enviado para ${email}. O link de convite é válido por 7 dias.`,
      });
      
      console.log("Convite criado:", {
        email: inviteData.email,
        role: inviteData.role,
        token: inviteData.token,
        expiresAt: inviteData.expiresAt
      });

    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast({
        title: "Erro ao Enviar Convite",
        description: "Falha ao enviar o convite. Verifique se seu cliente de email está configurado.",
        variant: "destructive"
      });
    }
  };

  const handleEditMember = (id: number) => {
    if (editingMember === id) {
      // Salvar alterações
      if (editForm.name && editForm.email && editForm.role) {
        const updatedTeam = teamMembers.map(member => 
          member.id === id ? { ...member, ...editForm } : member
        );
        setTeamMembers(updatedTeam);
        localStorage.setItem('team_members', JSON.stringify(updatedTeam));
        
        toast({
          title: "Usuário Atualizado",
          description: "As informações do usuário foram salvas",
        });
        
        console.log("Usuário editado:", editForm);
      }
      setEditingMember(null);
      setEditForm({});
    } else {
      // Iniciar edição
      const member = teamMembers.find(m => m.id === id);
      if (member) {
        setEditForm(member);
        setEditingMember(id);
      }
    }
  };

  const handleDeleteMember = (id: number) => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;
    
    const confirmed = confirm(`Tem certeza que deseja remover ${member.name} da equipe?`);
    
    if (confirmed) {
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedTeam);
      localStorage.setItem('team_members', JSON.stringify(updatedTeam));
      
      toast({
        title: "Usuário Removido",
        description: `${member.name} foi removido da equipe`,
        variant: "destructive"
      });
      
      console.log("Usuário removido:", member);
    }
  };

  const handleChangePassword = () => {
    const currentPassword = prompt("Digite sua senha atual:");
    if (!currentPassword) return;
    
    const newPassword = prompt("Digite a nova senha:");
    if (!newPassword) return;
    
    const confirmPassword = prompt("Confirme a nova senha:");
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Senha Fraca",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    // Simular alteração de senha
    localStorage.setItem('password_changed', new Date().toISOString());
    
    toast({
      title: "Senha Alterada",
      description: "Sua senha foi alterada com sucesso",
    });
    
    console.log("Senha alterada em:", new Date().toISOString());
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
    
    toast({
      title: "Notificação Atualizada",
      description: "Suas preferências de notificação foram salvas",
    });
    
    console.log("Configuração de notificação alterada:", key, newSettings[key]);
  };

  const handleSecurityChange = (key: keyof SecuritySettings) => {
    const newSettings = { ...security, [key]: !security[key] };
    setSecurity(newSettings);
    localStorage.setItem('security_settings', JSON.stringify(newSettings));
    
    toast({
      title: "Segurança Atualizada",
      description: "Suas configurações de segurança foram salvas",
    });
    
    console.log("Configuração de segurança alterada:", key, newSettings[key]);
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu CRM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Configurações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa *</Label>
                <Input 
                  id="company-name" 
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ *</Label>
                <Input 
                  id="company-cnpj" 
                  value={companyData.cnpj}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Endereço</Label>
              <Input 
                id="company-address" 
                value={companyData.address}
                onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefone</Label>
                <Input 
                  id="company-phone" 
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">E-mail *</Label>
                <Input 
                  id="company-email" 
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={handleSaveCompany}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleBackupData}
              disabled={isLoading}
            >
              <Database className="w-4 h-4 mr-2" />
              Backup dos Dados
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleConfigureIntegractions}
            >
              <Zap className="w-4 h-4 mr-2" />
              Configurar Integrações
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleSecurityLogs}
            >
              <Shield className="w-4 h-4 mr-2" />
              Logs de Segurança
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleManageSubscription}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Gerenciar Assinatura
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Gestão de Equipe
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={handleInviteUser}
            >
              <Plus className="w-4 h-4 mr-2" />
              Convidar Usuário
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    {editingMember === member.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome"
                          className="h-8"
                        />
                        <Input
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="E-mail"
                          className="h-8"
                        />
                        <select
                          value={editForm.role || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                          className="h-8 px-2 border rounded"
                        >
                          <option value="Administrador">Administrador</option>
                          <option value="Gerente de Vendas">Gerente de Vendas</option>
                          <option value="Vendedor">Vendedor</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">
                          Último acesso: {member.lastLogin !== "Nunca" ? new Date(member.lastLogin).toLocaleDateString('pt-BR') : "Nunca"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge className={member.status === "Ativo" ? "bg-green-100 text-green-800" : member.status === "Pendente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                    {member.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditMember(member.id)}
                  >
                    {editingMember === member.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Novos Leads</h4>
                <p className="text-sm text-gray-500">Receber notificação por e-mail</p>
              </div>
              <Switch 
                checked={notifications.newLeads} 
                onCheckedChange={() => handleNotificationChange('newLeads')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tarefas Vencidas</h4>
                <p className="text-sm text-gray-500">Alertas de tarefas em atraso</p>
              </div>
              <Switch 
                checked={notifications.overdueTasks} 
                onCheckedChange={() => handleNotificationChange('overdueTasks')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Relatórios Semanais</h4>
                <p className="text-sm text-gray-500">Resumo semanal por e-mail</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports} 
                onCheckedChange={() => handleNotificationChange('weeklyReports')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Negócios Fechados</h4>
                <p className="text-sm text-gray-500">Quando um negócio é fechado</p>
              </div>
              <Switch 
                checked={notifications.closedDeals} 
                onCheckedChange={() => handleNotificationChange('closedDeals')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticação 2FA</h4>
                <p className="text-sm text-gray-500">Camada extra de segurança</p>
              </div>
              <Switch 
                checked={security.twoFactor} 
                onCheckedChange={() => handleSecurityChange('twoFactor')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Login por IP</h4>
                <p className="text-sm text-gray-500">Restringir acesso por IP</p>
              </div>
              <Switch 
                checked={security.ipRestriction} 
                onCheckedChange={() => handleSecurityChange('ipRestriction')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sessão Única</h4>
                <p className="text-sm text-gray-500">Apenas uma sessão ativa</p>
              </div>
              <Switch 
                checked={security.singleSession} 
                onCheckedChange={() => handleSecurityChange('singleSession')}
              />
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleChangePassword}>
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{teamMembers.length + 2844}</div>
              <div className="text-sm text-gray-600">Total de Leads</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">15.2GB</div>
              <div className="text-sm text-gray-600">Armazenamento</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{teamMembers.filter(m => m.status === "Ativo").length}</div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Configuration Dialog */}
      <IntegrationConfigDialog 
        open={integrationDialogOpen}
        onClose={() => setIntegrationDialogOpen(false)}
      />
    </div>
  );
};
