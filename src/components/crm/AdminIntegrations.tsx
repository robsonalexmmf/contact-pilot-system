
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Zap, 
  MessageCircle, 
  Mail,
  Calendar,
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  Plus,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'active' | 'inactive' | 'error';
  category: string;
  webhook_url?: string;
  api_key?: string;
  last_sync?: string;
  total_syncs?: number;
}

export const AdminIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const defaultIntegrations: Integration[] = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Conecte com 5000+ aplicações',
      icon: Zap,
      status: 'active',
      category: 'Automação',
      webhook_url: 'https://hooks.zapier.com/hooks/catch/...',
      total_syncs: 1247
    },
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Automação de workflow open source',
      icon: Zap,
      status: 'active',
      category: 'Automação',
      webhook_url: 'https://n8n.io/webhook/...',
      total_syncs: 856
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      description: 'Integração com WhatsApp para mensagens',
      icon: MessageCircle,
      status: 'active',
      category: 'Comunicação',
      api_key: 'wa_key_***',
      total_syncs: 3421
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Notificações e alertas para equipe',
      icon: MessageCircle,
      status: 'active',
      category: 'Comunicação',
      webhook_url: 'https://hooks.slack.com/services/...',
      total_syncs: 567
    },
    {
      id: 'rd_station',
      name: 'RD Station',
      description: 'Marketing automation e leads',
      icon: Mail,
      status: 'inactive',
      category: 'Marketing',
      api_key: 'rd_key_***',
      total_syncs: 234
    },
    {
      id: 'active_campaign',
      name: 'ActiveCampaign',
      description: 'Email marketing e automação',
      icon: Mail,
      status: 'inactive',
      category: 'Marketing',
      api_key: 'ac_key_***',
      total_syncs: 156
    },
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      description: 'Sincronização de eventos e reuniões',
      icon: Calendar,
      status: 'active',
      category: 'Produtividade',
      api_key: 'gc_key_***',
      total_syncs: 892
    },
    {
      id: 'google_sheets',
      name: 'Google Sheets',
      description: 'Exportação de dados e relatórios',
      icon: Database,
      status: 'active',
      category: 'Produtividade',
      api_key: 'gs_key_***',
      total_syncs: 445
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Assinatura digital de documentos',
      icon: Shield,
      status: 'inactive',
      category: 'Documentos',
      api_key: 'ds_key_***',
      total_syncs: 78
    },
    {
      id: 'clicksign',
      name: 'ClickSign',
      description: 'Assinatura digital brasileira',
      icon: Shield,
      status: 'active',
      category: 'Documentos',
      api_key: 'cs_key_***',
      total_syncs: 123
    }
  ];

  const fetchIntegrations = async () => {
    try {
      console.log('Carregando integrações...');
      
      // Simular carregamento de integrações
      setTimeout(() => {
        setIntegrations(defaultIntegrations);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active',
            last_sync: integration.status === 'inactive' ? new Date().toISOString() : integration.last_sync
          }
        : integration
    ));

    const integration = integrations.find(i => i.id === id);
    toast({
      title: integration?.status === 'active' ? 'Integração Desativada' : 'Integração Ativada',
      description: `${integration?.name} foi ${integration?.status === 'active' ? 'desativada' : 'ativada'} com sucesso`,
    });
  };

  const handleTestIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    
    toast({
      title: 'Teste de Integração',
      description: `Testando conexão com ${integration?.name}...`,
    });

    // Simular teste
    setTimeout(() => {
      toast({
        title: 'Teste Concluído',
        description: `Conexão com ${integration?.name} funcionando corretamente`,
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <div className="w-4 h-4 rounded-full bg-gray-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const categories = [...new Set(integrations.map(i => i.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando integrações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
          <p className="text-gray-600">Gerencie todas as integrações do sistema</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Integrações</p>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inativas</p>
                <p className="text-2xl font-bold text-gray-600">
                  {integrations.filter(i => i.status === 'inactive').length}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sincronizações</p>
                <p className="text-2xl font-bold text-purple-600">
                  {integrations.reduce((sum, i) => sum + (i.total_syncs || 0), 0).toLocaleString()}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations by Category */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations
                .filter(integration => integration.category === category)
                .map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-8 h-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(integration.status)}
                          <Switch
                            checked={integration.status === 'active'}
                            onCheckedChange={() => handleToggleIntegration(integration.id)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'active' ? 'Ativa' : 
                             integration.status === 'inactive' ? 'Inativa' : 'Erro'}
                          </Badge>
                          {integration.total_syncs && (
                            <span className="text-xs text-gray-500">
                              {integration.total_syncs.toLocaleString()} syncs
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestIntegration(integration.id)}
                            disabled={integration.status !== 'active'}
                          >
                            Testar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {integration.webhook_url && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">Webhook:</span> {integration.webhook_url.substring(0, 40)}...
                        </div>
                      )}

                      {integration.api_key && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">API Key:</span> {integration.api_key}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
