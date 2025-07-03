import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { NewAutomationDialog } from "./NewAutomationDialog";
import { EditAutomationDialog } from "./EditAutomationDialog";
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Plus, 
  Clock, 
  Target, 
  MessageSquare, 
  Mail, 
  Phone,
  Zap,
  BarChart3,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Repeat,
  Filter,
  Settings,
  Activity,
  TrendingUp
} from "lucide-react";

// Mock data for automations
const mockAutomations = [
  {
    id: 1,
    name: "Boas-vindas para Novos Leads",
    description: "Envia mensagem automática quando novo lead é criado",
    trigger: "new_lead",
    action: "send_whatsapp",
    status: "active",
    executions: 247,
    success_rate: 94.2,
    last_run: "2024-01-15 14:30:00",
    delay_minutes: 0,
    message: "Olá! Obrigado por seu interesse. Em breve entraremos em contato!",
    target_group: "all",
    webhook_url: ""
  },
  {
    id: 2,
    name: "Follow-up Automático",
    description: "Envia lembrança após 3 dias sem resposta",
    trigger: "no_response",
    action: "send_email",
    status: "active",
    executions: 156,
    success_rate: 87.8,
    last_run: "2024-01-15 10:15:00",
    delay_minutes: 4320,
    message: "Olá! Ainda tem interesse em nossos serviços?",
    target_group: "qualified",
    webhook_url: ""
  },
  {
    id: 3,
    name: "Notificação de Oportunidade",
    description: "Alerta equipe quando lead vira oportunidade",
    trigger: "lead_qualified",
    action: "send_notification",
    status: "active",
    executions: 89,
    success_rate: 98.9,
    last_run: "2024-01-15 16:45:00",
    delay_minutes: 0,
    message: "Novo lead qualificado! Valor estimado: {lead_value}",
    target_group: "sales_team",
    webhook_url: ""
  },
  {
    id: 4,
    name: "Integração Zapier",
    description: "Sincroniza dados com ferramentas externas",
    trigger: "deal_won",
    action: "webhook",
    status: "paused",
    executions: 34,
    success_rate: 91.2,
    last_run: "2024-01-14 09:20:00",
    delay_minutes: 0,
    message: "",
    target_group: "won_deals",
    webhook_url: "https://hooks.zapier.com/hooks/catch/..."
  },
  {
    id: 5,
    name: "Lembrete de Proposta",
    description: "Notifica sobre propostas próximas do vencimento",
    trigger: "proposal_expiring",
    action: "send_whatsapp",
    status: "active",
    executions: 67,
    success_rate: 85.1,
    last_run: "2024-01-15 08:00:00",
    delay_minutes: 0,
    message: "Sua proposta vence em 2 dias. Gostaria de revisá-la?",
    target_group: "active_proposals",
    webhook_url: ""
  }
];

const quickActions = [
  { 
    trigger: "new_lead", 
    action: "send_whatsapp", 
    label: "WhatsApp para Novos Leads",
    icon: MessageSquare,
    color: "bg-green-500"
  },
  { 
    trigger: "no_response", 
    action: "send_email", 
    label: "Email de Follow-up",
    icon: Mail,
    color: "bg-blue-500"
  },
  { 
    trigger: "deal_won", 
    action: "webhook", 
    label: "Webhook para Vendas",
    icon: Zap,
    color: "bg-purple-500"
  },
  { 
    trigger: "lead_qualified", 
    action: "send_notification", 
    label: "Notificar Equipe",
    icon: Users,
    color: "bg-orange-500"
  }
];

const automationStats = [
  { label: "Total de Automações", value: "5", icon: Zap, color: "text-blue-600" },
  { label: "Execuções Hoje", value: "23", icon: Activity, color: "text-green-600" },
  { label: "Taxa de Sucesso", value: "91.4%", icon: CheckCircle, color: "text-emerald-600" },
  { label: "Tempo Economizado", value: "4.2h", icon: Clock, color: "text-purple-600" }
];

export const AutomationManager = () => {
  const [automations, setAutomations] = useState(mockAutomations);
  const [editingAutomation, setEditingAutomation] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [preselectedTrigger, setPreselectedTrigger] = useState<string>("");
  const [preselectedAction, setPreselectedAction] = useState<string>("");
  const [executingAutomations, setExecutingAutomations] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleToggleAutomation = (id: number) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { ...automation, status: automation.status === 'active' ? 'paused' : 'active' }
          : automation
      )
    );
    
    const automation = automations.find(a => a.id === id);
    toast({
      title: automation?.status === 'active' ? "Automação Pausada" : "Automação Ativada",
      description: `${automation?.name} foi ${automation?.status === 'active' ? 'pausada' : 'ativada'}`,
    });
  };

  const handleEditAutomation = (automationId: number) => {
    const automation = automations.find(a => a.id === automationId);
    if (automation) {
      setEditingAutomation(automation);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteAutomation = (id: number) => {
    const automation = automations.find(a => a.id === id);
    if (confirm(`Deseja realmente excluir a automação "${automation?.name}"?`)) {
      setAutomations(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Automação Excluída",
        description: `${automation?.name} foi removida`,
        variant: "destructive"
      });
    }
  };

  const handleRunAutomation = async (id: number) => {
    const automation = automations.find(a => a.id === id);
    if (!automation) return;

    setExecutingAutomations(prev => new Set([...prev, id]));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAutomations(prev => 
        prev.map(a => 
          a.id === id 
            ? { ...a, executions: a.executions + 1, last_run: new Date().toLocaleString() }
            : a
        )
      );

      toast({
        title: "Automação Executada",
        description: `${automation.name} foi executada com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro na Execução",
        description: "Falha ao executar a automação",
        variant: "destructive"
      });
    } finally {
      setExecutingAutomations(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCreateAutomation = (newAutomation: any) => {
    const automation = {
      id: Date.now(),
      ...newAutomation,
      executions: 0,
      success_rate: 0,
      last_run: "Nunca executada",
      status: "active"
    };
    
    setAutomations(prev => [...prev, automation]);
    setIsNewDialogOpen(false);
    setPreselectedTrigger("");
    setPreselectedAction("");
    
    toast({
      title: "Automação Criada",
      description: `${automation.name} foi criada com sucesso`,
    });
  };

  const handleUpdateAutomation = (updatedAutomation: any) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === updatedAutomation.id 
          ? updatedAutomation
          : automation
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingAutomation(null);
    
    toast({
      title: "Automação Atualizada",
      description: `${updatedAutomation.name} foi atualizada`,
    });
  };

  const handleQuickAction = (trigger: string, action: string) => {
    setPreselectedTrigger(trigger);
    setPreselectedAction(action);
    setIsNewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsNewDialogOpen(false);
    setPreselectedTrigger("");
    setPreselectedAction("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automações</h1>
          <p className="text-gray-600">20 tipos de automações inteligentes funcionando em tempo real</p>
        </div>
        <Button 
          onClick={() => setIsNewDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {automationStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col space-y-2 hover:shadow-md transition-shadow"
                  onClick={() => handleQuickAction(action.trigger, action.action)}
                >
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automations List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                    <Badge className={getStatusColor(automation.status)}>
                      {automation.status === 'active' ? 'Ativa' : 'Pausada'}
                    </Badge>
                    {automation.status === 'active' && (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                        <span className="text-xs">Executando</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{automation.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Execuções</p>
                      <p className="font-medium">{automation.executions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Taxa de Sucesso</p>
                      <p className={`font-medium ${getSuccessRateColor(automation.success_rate)}`}>
                        {automation.success_rate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Última Execução</p>
                      <p className="font-medium">{automation.last_run}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Delay</p>
                      <p className="font-medium">
                        {automation.delay_minutes > 0 
                          ? `${Math.floor(automation.delay_minutes / 60)}h ${automation.delay_minutes % 60}min`
                          : 'Imediato'
                        }
                      </p>
                    </div>
                  </div>

                  {automation.success_rate > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Performance</span>
                        <span className={getSuccessRateColor(automation.success_rate)}>
                          {automation.success_rate}%
                        </span>
                      </div>
                      <Progress value={automation.success_rate} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={automation.status === 'active'}
                    onCheckedChange={() => handleToggleAutomation(automation.id)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunAutomation(automation.id)}
                    disabled={executingAutomations.has(automation.id)}
                  >
                    {executingAutomations.has(automation.id) ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditAutomation(automation.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteAutomation(automation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Automation Dialog */}
      <NewAutomationDialog 
        open={isNewDialogOpen}
        onClose={handleDialogClose}
        onSave={handleCreateAutomation}
        preselectedTrigger={preselectedTrigger}
        preselectedAction={preselectedAction}
      />

      {/* Edit Dialog */}
      <EditAutomationDialog 
        automation={editingAutomation}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingAutomation(null);
        }}
        onUpdateAutomation={handleUpdateAutomation}
      />
    </div>
  );
};
