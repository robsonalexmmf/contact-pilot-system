
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  MessageSquare, 
  Mail, 
  Calendar,
  Slack,
  Save,
  Trash2,
  Plus,
  Globe,
  TestTube,
  Settings,
  Webhook
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  enabled: boolean;
  webhookUrl: string;
  apiKey: string;
  category: string;
  isFromAdmin?: boolean;
  testStatus?: 'success' | 'failed' | 'pending';
  lastTested?: string;
}

interface IntegrationConfigDialogProps {
  open: boolean;
  onClose: () => void;
}

export const IntegrationConfigDialog = ({ open, onClose }: IntegrationConfigDialogProps) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [editingIntegration, setEditingIntegration] = useState<string | null>(null);
  const [testingIntegrations, setTestingIntegrations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Carregar configurações salvas e integrações do admin
  useEffect(() => {
    if (open) {
      loadIntegrations();
    }
  }, [open]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      
      // Integrações padrão do usuário
      const defaultIntegrations: Integration[] = [
        {
          id: "zapier",
          name: "Zapier",
          description: "Conecte com mais de 5000 aplicativos",
          icon: <Zap className="w-5 h-5" />,
          enabled: false,
          webhookUrl: "",
          apiKey: "",
          category: "Automação"
        },
        {
          id: "whatsapp",
          name: "WhatsApp Business",
          description: "Integração com WhatsApp para atendimento",
          icon: <MessageSquare className="w-5 h-5" />,
          enabled: false,
          webhookUrl: "",
          apiKey: "",
          category: "Comunicação"
        },
        {
          id: "gmail",
          name: "Gmail",
          description: "Sincronize e-mails automaticamente",
          icon: <Mail className="w-5 h-5" />,
          enabled: false,
          webhookUrl: "",
          apiKey: "",
          category: "E-mail"
        },
        {
          id: "calendar",
          name: "Google Calendar",
          description: "Sincronize compromissos e reuniões",
          icon: <Calendar className="w-5 h-5" />,
          enabled: false,
          webhookUrl: "",
          apiKey: "",
          category: "Calendário"
        },
        {
          id: "slack",
          name: "Slack",
          description: "Notificações e automações no Slack",
          icon: <Slack className="w-5 h-5" />,
          enabled: false,
          webhookUrl: "",
          apiKey: "",
          category: "Comunicação"
        }
      ];

      // Carregar configurações locais do usuário
      const saved = localStorage.getItem('integration_configs');
      let userIntegrations = defaultIntegrations;
      
      if (saved) {
        try {
          const savedIntegrations = JSON.parse(saved);
          userIntegrations = defaultIntegrations.map(integration => {
            const savedIntegration = savedIntegrations.find((s: Integration) => s.id === integration.id);
            return savedIntegration || integration;
          });
        } catch (error) {
          console.error("Erro ao carregar integrações:", error);
        }
      }

      // Carregar integrações administrativas
      const adminIntegrations = localStorage.getItem('admin_integrations');
      const allIntegrations = [...userIntegrations];
      
      if (adminIntegrations) {
        try {
          const adminInts = JSON.parse(adminIntegrations);
          console.log('🔗 Integrações administrativas carregadas:', adminInts);
          
          // Adicionar integrações administrativas à lista
          adminInts.forEach((adminInt: any) => {
            // Verificar se já existe uma integração com o mesmo nome
            const existingIndex = allIntegrations.findIndex(int => 
              int.name.toLowerCase().includes(adminInt.name.toLowerCase().split(' ')[0])
            );
            
            if (existingIndex === -1) {
              // Adicionar nova integração do admin
              allIntegrations.push({
                id: adminInt.id,
                name: adminInt.name,
                description: `${adminInt.description} (Configuração Global)`,
                icon: <Globe className="w-5 h-5" />,
                enabled: adminInt.enabled,
                webhookUrl: adminInt.webhookUrl,
                apiKey: adminInt.apiKey,
                category: adminInt.category,
                isFromAdmin: true
              });
            } else {
              // Sobrescrever com configuração administrativa se estiver ativa
              if (adminInt.enabled) {
                allIntegrations[existingIndex] = {
                  ...allIntegrations[existingIndex],
                  webhookUrl: adminInt.webhookUrl,
                  apiKey: adminInt.apiKey,
                  enabled: adminInt.enabled,
                  description: `${allIntegrations[existingIndex].description} (Configuração Global)`,
                  isFromAdmin: true
                };
              }
            }
          });
          
        } catch (error) {
          console.error("Erro ao carregar integrações administrativas:", error);
        }
      }

      setIntegrations(allIntegrations);
      console.log('✅ Integrações carregadas:', allIntegrations);
      
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar integrações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    
    if (integration?.isFromAdmin) {
      toast({
        title: "Integração Administrativa",
        description: "Esta integração é gerenciada pelo administrador e não pode ser desabilitada",
        variant: "destructive"
      });
      return;
    }

    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const handleUpdateIntegration = (id: string, field: 'webhookUrl' | 'apiKey', value: string) => {
    const integration = integrations.find(i => i.id === id);
    
    if (integration?.isFromAdmin) {
      toast({
        title: "Integração Administrativa",
        description: "Esta integração é gerenciada pelo administrador",
        variant: "destructive"
      });
      return;
    }

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

    if (integration.isFromAdmin) {
      toast({
        title: "Integração Administrativa",
        description: "Esta integração é gerenciada pelo administrador",
        variant: "destructive"
      });
      return;
    }

    // Validar campos obrigatórios
    if (integration.enabled) {
      if (!integration.webhookUrl.trim()) {
        toast({
          title: "Erro de Validação",
          description: `Webhook URL é obrigatório para ${integration.name}`,
          variant: "destructive"
        });
        return;
      }

      // Validar URL
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

    // Salvar apenas integrações do usuário (não administrativas)
    const userIntegrations = integrations.filter(int => !int.isFromAdmin);
    localStorage.setItem('integration_configs', JSON.stringify(userIntegrations));
    
    setEditingIntegration(null);
    
    toast({
      title: "Integração Configurada",
      description: `${integration.name} foi configurada com sucesso`,
    });

    console.log(`✅ Integração ${integration.name} configurada:`, {
      enabled: integration.enabled,
      webhookUrl: integration.webhookUrl,
      apiKey: integration.apiKey ? "***configured***" : ""
    });
  };

  const handleTestWebhook = async (integration: Integration) => {
    if (!integration.webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Configure o webhook URL primeiro",
        variant: "destructive"
      });
      return;
    }

    setTestingIntegrations(prev => new Set([...prev, integration.id]));

    try {
      const testPayload = {
        test: true,
        integration: integration.name,
        timestamp: new Date().toISOString(),
        source: "user_settings",
        data: {
          message: "Teste de integração do CRM",
          user_test: true
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

      // Atualizar status do teste
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { 
                ...int, 
                testStatus: 'success' as const,
                lastTested: new Date().toISOString()
              }
            : int
        )
      );

      toast({
        title: "Webhook Testado",
        description: `Teste enviado para ${integration.name}. Verifique o destino para confirmar.`,
      });

      console.log(`🧪 Webhook testado para ${integration.name}:`, testPayload);
      
    } catch (error) {
      console.error("Erro no teste de webhook:", error);
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { 
                ...int, 
                testStatus: 'failed' as const,
                lastTested: new Date().toISOString()
              }
            : int
        )
      );
      
      toast({
        title: "Erro no Teste",
        description: "Falha ao testar o webhook",
        variant: "destructive"
      });
    } finally {
      setTestingIntegrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(integration.id);
        return newSet;
      });
    }
  };

  const handleRemoveIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.isFromAdmin) {
      toast({
        title: "Integração Administrativa",
        description: "Esta integração é gerenciada pelo administrador e não pode ser removida",
        variant: "destructive"
      });
      return;
    }

    const confirmed = confirm(`Deseja remover a configuração de ${integration.name}?`);
    if (!confirmed) return;

    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: false, webhookUrl: "", apiKey: "" }
          : integration
      )
    );

    // Salvar apenas integrações do usuário
    const userIntegrations = integrations.filter(int => !int.isFromAdmin);
    localStorage.setItem('integration_configs', JSON.stringify(userIntegrations));

    toast({
      title: "Integração Removida",
      description: `${integration.name} foi desconfigurada`,
      variant: "destructive"
    });

    console.log(`🗑️ Integração ${integration.name} removida`);
  };

  const enabledCount = integrations.filter(i => i.enabled).length;
  const adminCount = integrations.filter(i => i.isFromAdmin).length;
  const userCount = integrations.filter(i => !i.isFromAdmin).length;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando integrações...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Configurar Integrações
          </DialogTitle>
          <DialogDescription>
            Configure webhooks e APIs para conectar seu CRM com outros serviços
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm font-medium">Integrações Ativas:</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {enabledCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-sm font-medium">Administrativas:</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {adminCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <span className="text-sm font-medium">Pessoais:</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                {userCount}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {integrations.map((integration) => (
            <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {integration.category}
                      </Badge>
                      {integration.isFromAdmin && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          Admin
                        </Badge>
                      )}
                      {integration.testStatus && (
                        <Badge className={`text-xs ${
                          integration.testStatus === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {integration.testStatus === 'success' ? 'Testada ✓' : 'Falha no teste'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                    disabled={integration.isFromAdmin}
                  />
                  {editingIntegration === integration.id ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleSaveIntegration(integration.id)}
                      disabled={integration.isFromAdmin}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingIntegration(integration.id)}
                      disabled={integration.isFromAdmin}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {(integration.enabled || editingIntegration === integration.id) && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="space-y-2">
                    <Label htmlFor={`webhook-${integration.id}`}>
                      Webhook URL {!integration.isFromAdmin && "*"}
                    </Label>
                    <Input
                      id={`webhook-${integration.id}`}
                      value={integration.webhookUrl}
                      onChange={(e) => handleUpdateIntegration(integration.id, 'webhookUrl', e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      disabled={editingIntegration !== integration.id || integration.isFromAdmin}
                      type={integration.isFromAdmin ? "password" : "text"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`apikey-${integration.id}`}>
                      API Key / Token (opcional)
                    </Label>
                    <Input
                      id={`apikey-${integration.id}`}
                      type="password"
                      value={integration.apiKey}
                      onChange={(e) => handleUpdateIntegration(integration.id, 'apiKey', e.target.value)}
                      placeholder="Chave de API ou token de autenticação"
                      disabled={editingIntegration !== integration.id || integration.isFromAdmin}
                    />
                  </div>

                  {integration.enabled && editingIntegration !== integration.id && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTestWebhook(integration)}
                        disabled={testingIntegrations.has(integration.id)}
                      >
                        <TestTube className="w-4 h-4 mr-1" />
                        {testingIntegrations.has(integration.id) ? "Testando..." : "Testar"}
                      </Button>
                      {!integration.isFromAdmin && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRemoveIntegration(integration.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remover
                        </Button>
                      )}
                    </div>
                  )}

                  {integration.lastTested && (
                    <div className="text-xs text-gray-500">
                      Último teste: {new Date(integration.lastTested).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {adminCount > 0 && (
              <span className="text-blue-600">
                {adminCount} integração(ões) gerenciada(s) pelo administrador
              </span>
            )}
          </div>
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
