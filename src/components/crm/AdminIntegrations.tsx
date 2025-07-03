
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Settings, 
  Zap,
  MessageSquare,
  Mail,
  Calendar,
  Slack,
  Globe,
  Key,
  Webhook,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdminIntegration {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  enabled: boolean;
  webhookUrl: string;
  apiKey: string;
  category: string;
  isGlobal: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export const AdminIntegrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<AdminIntegration[]>([
    {
      id: "zapier-global",
      name: "Zapier Global",
      description: "Integração global com Zapier para todos os usuários",
      icon: <Zap className="w-5 h-5" />,
      enabled: true,
      webhookUrl: "https://hooks.zapier.com/hooks/catch/global/webhook",
      apiKey: "",
      category: "Automação",
      isGlobal: true,
      createdAt: "2024-01-10",
      lastUsed: "2024-01-15",
      usageCount: 1250
    },
    {
      id: "whatsapp-business",
      name: "WhatsApp Business API",
      description: "API oficial do WhatsApp para mensagens",
      icon: <MessageSquare className="w-5 h-5" />,
      enabled: true,
      webhookUrl: "https://api.whatsapp.com/webhook",
      apiKey: "whatsapp_api_key_123",
      category: "Comunicação",
      isGlobal: true,
      createdAt: "2024-01-08",
      lastUsed: "2024-01-15",
      usageCount: 890
    },
    {
      id: "smtp-global",
      name: "SMTP Global",
      description: "Servidor SMTP para envio de emails do sistema",
      icon: <Mail className="w-5 h-5" />,
      enabled: true,
      webhookUrl: "smtp://mail.empresa.com:587",
      apiKey: "smtp_password_secure",
      category: "E-mail",
      isGlobal: true,
      createdAt: "2024-01-05",
      lastUsed: "2024-01-15",
      usageCount: 2340
    },
    {
      id: "slack-admin",
      name: "Slack Administrativo",
      description: "Notificações administrativas no Slack",
      icon: <Slack className="w-5 h-5" />,
      enabled: false,
      webhookUrl: "",
      apiKey: "",
      category: "Comunicação",
      isGlobal: true,
      createdAt: "2024-01-12",
      usageCount: 0
    }
  ]);

  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [newIntegrationDialog, setNewIntegrationDialog] = useState(false);

  // Sincronizar com as integrações do CRM regular quando salvadas
  useEffect(() => {
    const syncIntegrationsWithCRM = () => {
      // Obter integrações administrativas ativas
      const activeIntegrations = integrations.filter(int => int.enabled && int.isGlobal);
      
      // Salvar no localStorage para que o CRM possa acessar
      const crmIntegrations = activeIntegrations.map(int => ({
        id: int.id,
        name: int.name,
        description: int.description,
        icon: int.category, // Simplificado para o CRM
        enabled: int.enabled,
        webhookUrl: int.webhookUrl,
        apiKey: int.apiKey,
        category: int.category,
        isFromAdmin: true
      }));
      
      localStorage.setItem('admin_integrations', JSON.stringify(crmIntegrations));
      console.log('Integrações sincronizadas com o CRM:', crmIntegrations);
    };

    syncIntegrationsWithCRM();
  }, [integrations]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const handleUpdateIntegration = (id: string, field: keyof AdminIntegration, value: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, [field]: value }
          : integration
      )
    );
  };

  const handleSaveIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.enabled && !integration.webhookUrl.trim()) {
      toast({
        title: "Erro de Validação",
        description: `URL de webhook é obrigatória para ${integration.name}`,
        variant: "destructive"
      });
      return;
    }

    // Salvar configurações
    localStorage.setItem('admin_integrations_config', JSON.stringify(integrations));
    
    setEditingIntegration(null);
    
    toast({
      title: "Integração Configurada",
      description: `${integration.name} foi configurada com sucesso`,
    });

    console.log(`Integração admin ${integration.name} configurada:`, {
      enabled: integration.enabled,
      webhookUrl: integration.webhookUrl,
      isGlobal: integration.isGlobal
    });
  };

  const handleAddNewIntegration = (data: {
    name: string;
    description: string;
    category: string;
    webhookUrl: string;
    apiKey: string;
  }) => {
    const newIntegration: AdminIntegration = {
      id: `custom-${Date.now()}`,
      name: data.name,
      description: data.description,
      icon: <Globe className="w-5 h-5" />,
      enabled: false,
      webhookUrl: data.webhookUrl,
      apiKey: data.apiKey,
      category: data.category,
      isGlobal: true,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setNewIntegrationDialog(false);
    
    toast({
      title: "Integração Criada",
      description: `${data.name} foi adicionada com sucesso`,
    });
  };

  const handleDeleteIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (confirm(`Deseja remover a integração ${integration.name}?`)) {
      setIntegrations(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Integração Removida",
        description: `${integration.name} foi removida`,
        variant: "destructive"
      });
    }
  };

  const activeIntegrations = integrations.filter(i => i.enabled).length;
  const totalUsage = integrations.reduce((sum, i) => sum + i.usageCount, 0);
  const globalIntegrations = integrations.filter(i => i.isGlobal).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrações Administrativas</h1>
          <p className="text-gray-600">Configure integrações globais que aparecem automaticamente no CRM</p>
        </div>
        <Dialog open={newIntegrationDialog} onOpenChange={setNewIntegrationDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Integração</DialogTitle>
              <DialogDescription>
                Esta integração ficará disponível para todos os usuários do CRM
              </DialogDescription>
            </DialogHeader>
            <NewIntegrationForm onSubmit={handleAddNewIntegration} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-green-600">{activeIntegrations}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Globais</p>
                <p className="text-2xl font-bold text-purple-600">{globalIntegrations}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uso Total</p>
                <p className="text-2xl font-bold text-orange-600">{totalUsage.toLocaleString()}</p>
              </div>
              <Webhook className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {integration.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <Badge className={integration.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {integration.enabled ? 'Ativa' : 'Inativa'}
                      </Badge>
                      {integration.isGlobal && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Global
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {integration.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{integration.description}</p>
                    
                    {editingIntegration === integration.id ? (
                      <div className="space-y-3">
                        <div>
                          <Label>Webhook URL</Label>
                          <Input
                            value={integration.webhookUrl}
                            onChange={(e) => handleUpdateIntegration(integration.id, 'webhookUrl', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <Label>API Key (opcional)</Label>
                          <Input
                            type="password"
                            value={integration.apiKey}
                            onChange={(e) => handleUpdateIntegration(integration.id, 'apiKey', e.target.value)}
                            placeholder="Chave de API"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Criada em</p>
                          <p className="font-medium">{integration.createdAt}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Último uso</p>
                          <p className="font-medium">{integration.lastUsed || 'Nunca'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Uso total</p>
                          <p className="font-medium">{integration.usageCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className={`font-medium ${integration.enabled ? 'text-green-600' : 'text-gray-600'}`}>
                            {integration.enabled ? 'Funcionando' : 'Desabilitada'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                  />
                  {editingIntegration === integration.id ? (
                    <Button onClick={() => handleSaveIntegration(integration.id)} size="sm">
                      Salvar
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingIntegration(integration.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteIntegration(integration.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Componente para formulário de nova integração
const NewIntegrationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Personalizada',
    webhookUrl: '',
    apiKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.webhookUrl.trim()) return;
    onSubmit(formData);
    setFormData({ name: '', description: '', category: 'Personalizada', webhookUrl: '', apiKey: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome da Integração</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: Minha API Personalizada"
          required
        />
      </div>
      <div>
        <Label>Descrição</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição da integração"
        />
      </div>
      <div>
        <Label>Categoria</Label>
        <Input
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Ex: API, Webhook, Automação"
        />
      </div>
      <div>
        <Label>Webhook URL</Label>
        <Input
          value={formData.webhookUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
          placeholder="https://api.exemplo.com/webhook"
          required
        />
      </div>
      <div>
        <Label>API Key (opcional)</Label>
        <Input
          type="password"
          value={formData.apiKey}
          onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
          placeholder="Chave de API se necessária"
        />
      </div>
      <Button type="submit" className="w-full">
        Criar Integração
      </Button>
    </form>
  );
};
