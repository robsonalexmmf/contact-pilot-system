
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  Eye,
  TestTube,
  Save
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminIntegration {
  id: string;
  name: string;
  description: string;
  iconName: string;
  enabled: boolean;
  webhookUrl: string;
  apiKey: string;
  category: string;
  isGlobal: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  lastTested?: string;
  testStatus?: 'success' | 'failed' | 'pending';
}

// Mapeamento de ícones
const iconMap: { [key: string]: any } = {
  Zap,
  MessageSquare,
  Mail,
  Slack,
  Globe,
  Calendar
};

export const AdminIntegrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<AdminIntegration[]>([]);
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [newIntegrationDialog, setNewIntegrationDialog] = useState(false);
  const [testingIntegrations, setTestingIntegrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Sincronizar integrações ativas com o CRM
  const syncIntegrationsWithCRM = () => {
    const activeIntegrations = integrations.filter(int => int.enabled && int.isGlobal);
    
    const crmIntegrations = activeIntegrations.map(int => ({
      id: int.id,
      name: int.name,
      description: int.description,
      enabled: int.enabled,
      webhookUrl: int.webhookUrl,
      apiKey: int.apiKey,
      category: int.category,
      isFromAdmin: true
    }));
    
    localStorage.setItem('admin_integrations', JSON.stringify(crmIntegrations));
    console.log('Integrações sincronizadas com o CRM:', crmIntegrations);
  };

  // Carregar integrações do Supabase
  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      
      // Carregar integrações salvas localmente primeiro
      const savedIntegrations = localStorage.getItem('admin_integrations_config');
      if (savedIntegrations) {
        const parsed = JSON.parse(savedIntegrations);
        setIntegrations(parsed);
      } else {
        // Integrações padrão se não houver nenhuma salva
        const defaultIntegrations: AdminIntegration[] = [
          {
            id: "zapier-global",
            name: "Zapier Global",
            description: "Integração global com Zapier para todos os usuários",
            iconName: "Zap",
            enabled: false,
            webhookUrl: "",
            apiKey: "",
            category: "Automação",
            isGlobal: true,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0
          },
          {
            id: "whatsapp-business",
            name: "WhatsApp Business API",
            description: "API oficial do WhatsApp para mensagens",
            iconName: "MessageSquare",
            enabled: false,
            webhookUrl: "",
            apiKey: "",
            category: "Comunicação",
            isGlobal: true,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0
          },
          {
            id: "smtp-global",
            name: "SMTP Global",
            description: "Servidor SMTP para envio de emails do sistema",
            iconName: "Mail",
            enabled: false,
            webhookUrl: "",
            apiKey: "",
            category: "E-mail",
            isGlobal: true,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0
          },
          {
            id: "slack-admin",
            name: "Slack Administrativo",
            description: "Notificações administrativas no Slack",
            iconName: "Slack",
            enabled: false,
            webhookUrl: "",
            apiKey: "",
            category: "Comunicação",
            isGlobal: true,
            createdAt: new Date().toISOString().split('T')[0],
            usageCount: 0
          }
        ];
        setIntegrations(defaultIntegrations);
        localStorage.setItem('admin_integrations_config', JSON.stringify(defaultIntegrations));
      }

      // Sincronizar com localStorage para acesso do CRM
      syncIntegrationsWithCRM();
      
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar integrações administrativas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (id: string) => {
    const updatedIntegrations = integrations.map(integration => 
      integration.id === id 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    );
    
    setIntegrations(updatedIntegrations);
    await saveIntegrations(updatedIntegrations);
    
    const integration = integrations.find(i => i.id === id);
    toast({
      title: integration?.enabled ? "Integração Desabilitada" : "Integração Habilitada",
      description: `${integration?.name} foi ${integration?.enabled ? "desabilitada" : "habilitada"}`,
    });
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

  const handleSaveIntegration = async (id: string) => {
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

    // Validar URL se fornecida
    if (integration.webhookUrl.trim()) {
      try {
        new URL(integration.webhookUrl);
      } catch {
        toast({
          title: "URL Inválida",
          description: "Por favor, insira uma URL de webhook válida",
          variant: "destructive"
        });
        return;
      }
    }

    await saveIntegrations(integrations);
    setEditingIntegration(null);
    
    toast({
      title: "Integração Configurada",
      description: `${integration.name} foi configurada com sucesso`,
    });
  };

  const handleTestIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration || !integration.webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Configure o webhook URL primeiro",
        variant: "destructive"
      });
      return;
    }

    setTestingIntegrations(prev => new Set([...prev, id]));

    try {
      const testPayload = {
        test: true,
        integration: integration.name,
        timestamp: new Date().toISOString(),
        source: "admin_panel",
        data: {
          message: "Teste de integração administrativa",
          admin_test: true
        }
      };

      const response = await fetch(integration.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(integration.apiKey && { "Authorization": `Bearer ${integration.apiKey}` })
        },
        mode: "no-cors",
        body: JSON.stringify(testPayload)
      });

      // Atualizar estatísticas da integração
      const updatedIntegrations = integrations.map(int => 
        int.id === id 
          ? { 
              ...int, 
              lastTested: new Date().toISOString(),
              testStatus: 'success' as const,
              usageCount: int.usageCount + 1
            }
          : int
      );
      
      setIntegrations(updatedIntegrations);
      await saveIntegrations(updatedIntegrations);

      toast({
        title: "Teste Realizado",
        description: `Webhook testado para ${integration.name}. Verifique o destino para confirmar.`,
      });

    } catch (error) {
      console.error("Erro no teste:", error);
      
      const updatedIntegrations = integrations.map(int => 
        int.id === id 
          ? { 
              ...int, 
              lastTested: new Date().toISOString(),
              testStatus: 'failed' as const
            }
          : int
      );
      
      setIntegrations(updatedIntegrations);
      await saveIntegrations(updatedIntegrations);

      toast({
        title: "Erro no Teste",
        description: "Falha ao testar o webhook",
        variant: "destructive"
      });
    } finally {
      setTestingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleAddNewIntegration = async (data: {
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
      iconName: "Globe",
      enabled: false,
      webhookUrl: data.webhookUrl,
      apiKey: data.apiKey,
      category: data.category,
      isGlobal: true,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };

    const updatedIntegrations = [...integrations, newIntegration];
    setIntegrations(updatedIntegrations);
    await saveIntegrations(updatedIntegrations);
    
    setNewIntegrationDialog(false);
    
    toast({
      title: "Integração Criada",
      description: `${data.name} foi adicionada com sucesso`,
    });
  };

  const handleDeleteIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (confirm(`Deseja realmente remover a integração ${integration.name}?`)) {
      const updatedIntegrations = integrations.filter(i => i.id !== id);
      setIntegrations(updatedIntegrations);
      await saveIntegrations(updatedIntegrations);
      
      toast({
        title: "Integração Removida",
        description: `${integration.name} foi removida`,
        variant: "destructive"
      });
    }
  };

  const saveIntegrations = async (integrationsToSave: AdminIntegration[]) => {
    try {
      localStorage.setItem('admin_integrations_config', JSON.stringify(integrationsToSave));
      
      // Sincronizar com CRM
      const activeIntegrations = integrationsToSave.filter(int => int.enabled && int.isGlobal);
      const crmIntegrations = activeIntegrations.map(int => ({
        id: int.id,
        name: int.name,
        description: int.description,
        enabled: int.enabled,
        webhookUrl: int.webhookUrl,
        apiKey: int.apiKey,
        category: int.category,
        isFromAdmin: true
      }));
      
      localStorage.setItem('admin_integrations', JSON.stringify(crmIntegrations));
      
      console.log('Integrações salvas e sincronizadas:', crmIntegrations);
    } catch (error) {
      console.error("Erro ao salvar integrações:", error);
      throw error;
    }
  };

  const activeIntegrations = integrations.filter(i => i.enabled).length;
  const totalUsage = integrations.reduce((sum, i) => sum + i.usageCount, 0);
  const globalIntegrations = integrations.filter(i => i.isGlobal).length;
  const successfulTests = integrations.filter(i => i.testStatus === 'success').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando integrações...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-gray-600">Uso Total</p>
                <p className="text-2xl font-bold text-orange-600">{totalUsage.toLocaleString()}</p>
              </div>
              <Webhook className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Testadas</p>
                <p className="text-2xl font-bold text-purple-600">{successfulTests}</p>
              </div>
              <TestTube className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const IconComponent = iconMap[integration.iconName] || Globe;
          
          return (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <IconComponent className="w-5 h-5" />
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
                        {integration.testStatus && (
                          <Badge className={integration.testStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {integration.testStatus === 'success' ? 'Testada ✓' : 'Falha no teste'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{integration.description}</p>
                      
                      {editingIntegration === integration.id ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Webhook URL *</Label>
                            <Input
                              value={integration.webhookUrl}
                              onChange={(e) => handleUpdateIntegration(integration.id, 'webhookUrl', e.target.value)}
                              placeholder="https://hooks.zapier.com/hooks/catch/..."
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
                          <div className="flex space-x-2">
                            <Button onClick={() => handleSaveIntegration(integration.id)} size="sm">
                              <Save className="w-4 h-4 mr-1" />
                              Salvar
                            </Button>
                            <Button onClick={() => setEditingIntegration(null)} size="sm" variant="outline">
                              Cancelar
                            </Button>
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
                            <p className="text-gray-600">Último teste</p>
                            <p className="font-medium">{integration.lastTested ? new Date(integration.lastTested).toLocaleDateString() : 'Nunca'}</p>
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
                    {editingIntegration === integration.id ? null : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTestIntegration(integration.id)}
                          disabled={testingIntegrations.has(integration.id) || !integration.webhookUrl}
                        >
                          <TestTube className="w-4 h-4" />
                          {testingIntegrations.has(integration.id) ? "Testando..." : "Testar"}
                        </Button>
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
          );
        })}
      </div>

      {integrations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma integração configurada
          </h3>
          <p className="text-gray-500 mb-4">
            Adicione sua primeira integração administrativa
          </p>
          <Button onClick={() => setNewIntegrationDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Integração
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente para formulário de nova integração
const NewIntegrationForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    webhookUrl: '',
    apiKey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Automação',
    'Comunicação',
    'E-mail',
    'Calendário',
    'Analytics',
    'Personalizada'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', description: '', category: '', webhookUrl: '', apiKey: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome da Integração *</Label>
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
        <Label>Categoria *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Webhook URL</Label>
        <Input
          value={formData.webhookUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
          placeholder="https://api.exemplo.com/webhook"
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar Integração"}
      </Button>
    </form>
  );
};
