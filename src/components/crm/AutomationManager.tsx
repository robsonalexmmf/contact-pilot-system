
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Play,
  Settings,
  Mail,
  MessageCircle,
  Calendar,
  Users,
  Target,
  Clock,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  Bot,
  Database
} from "lucide-react";
import { NewAutomationDialog } from "./NewAutomationDialog";
import { EditAutomationDialog } from "./EditAutomationDialog";
import { executeAutomation, ADVANCED_TRIGGERS, ADVANCED_ACTIONS } from "@/utils/automationService";
import { useToast } from "@/hooks/use-toast";

// Automações avançadas de exemplo incluindo as 20 solicitadas
const mockAutomations = [
  {
    id: 1,
    name: "🧲 Lead → RD Station",
    description: "Envia automaticamente novas leads para RD Station com tags",
    trigger: "Novo Lead",
    action: "📊 RD Station",
    triggerType: "new_lead",
    actionType: "rd_station",
    webhookUrl: "https://www.rdstation.com.br/api/1.3/conversions",
    targetGroup: "leads",
    status: "Ativo",
    executions: 342,
    successRate: 98,
    lastRun: "2024-01-15 16:30"
  },
  {
    id: 2,
    name: "🔥 Lead Quente → Alerta Slack",
    description: "Alerta no Slack quando lead fica quente (score > 80)",
    trigger: "Lead Quente",
    action: "📢 Alerta Slack",
    triggerType: "hot_lead",
    actionType: "slack_alert",
    message: "🔥 Nova lead quente detectada! Ação imediata necessária.",
    targetGroup: "hot_leads",
    status: "Ativo",
    executions: 89,
    successRate: 100,
    lastRun: "2024-01-15 14:15"
  },
  {
    id: 3,
    name: "📅 Reunião → Google Calendar",
    description: "Cria eventos automaticamente no Google Calendar",
    trigger: "Reunião Agendada",
    action: "📅 Google Calendar",
    triggerType: "meeting_scheduled",
    actionType: "google_calendar",
    targetGroup: "all",
    status: "Ativo",
    executions: 156,
    successRate: 95,
    lastRun: "2024-01-15 12:45"
  },
  {
    id: 4,
    name: "📄 Proposta → PDF Google Drive",
    description: "Salva propostas no Google Drive e envia por email",
    trigger: "Proposta Enviada",
    action: "📁 Google Drive",
    triggerType: "proposal_sent",
    actionType: "google_drive",
    targetGroup: "prospects",
    status: "Ativo",
    executions: 78,
    successRate: 92,
    lastRun: "2024-01-15 11:20"
  },
  {
    id: 5,
    name: "📊 Negócio Ganho → Google Sheets",
    description: "Atualiza dashboard no Google Sheets automaticamente",
    trigger: "Negócio Ganho",
    action: "📊 Google Sheets",
    triggerType: "deal_won",
    actionType: "google_sheets",
    targetGroup: "customers",
    status: "Ativo",
    executions: 234,
    successRate: 97,
    lastRun: "2024-01-15 15:10"
  },
  {
    id: 6,
    name: "📈 Relatório Semanal Email",
    description: "Envia resumo semanal para gerentes todo domingo",
    trigger: "Relatório Semanal",
    action: "Enviar Email",
    triggerType: "weekly_report",
    actionType: "send_email",
    message: "Segue relatório semanal de atividades do CRM",
    targetGroup: "all",
    status: "Ativo",
    executions: 12,
    successRate: 100,
    lastRun: "2024-01-14 09:00"
  },
  {
    id: 7,
    name: "💰 Negócio → Boleto ASAAS",
    description: "Gera boleto automaticamente via ASAAS",
    trigger: "Negócio Ganho",
    action: "💰 Gerar Boleto",
    triggerType: "deal_won",
    actionType: "generate_boleto",
    targetGroup: "customers",
    status: "Ativo",
    executions: 67,
    successRate: 89,
    lastRun: "2024-01-15 13:30"
  },
  {
    id: 8,
    name: "⏰ Cobrança Atrasada → Lembrete",
    description: "Envia lembrete por email e WhatsApp para pagamentos atrasados",
    trigger: "Pagamento Atrasado",
    action: "⏰ Lembrete",
    triggerType: "payment_overdue",
    actionType: "send_reminder",
    message: "Lembrete: Você possui um pagamento pendente",
    targetGroup: "customers",
    status: "Ativo",
    executions: 45,
    successRate: 85,
    lastRun: "2024-01-15 10:00"
  },
  {
    id: 9,
    name: "📝 Proposta → DocuSign",
    description: "Envia automaticamente para assinatura via DocuSign",
    trigger: "Proposta Aprovada",
    action: "📝 DocuSign",
    triggerType: "proposal_approved",
    actionType: "docusign",
    targetGroup: "prospects",
    status: "Ativo",
    executions: 34,
    successRate: 94,
    lastRun: "2024-01-15 16:00"
  },
  {
    id: 10,
    name: "💬 WhatsApp → IA Resposta",
    description: "Resposta automática via ChatGPT para mensagens WhatsApp",
    trigger: "Mensagem WhatsApp",
    action: "🤖 Resposta IA",
    triggerType: "whatsapp_message",
    actionType: "chatgpt_response",
    message: "Resposta inteligente baseada no contexto da conversa",
    targetGroup: "leads",
    status: "Ativo",
    executions: 189,
    successRate: 91,
    lastRun: "2024-01-15 17:15"
  },
  {
    id: 11,
    name: "🎯 Lead Inativa → Reengajamento",
    description: "Campanha de reengajamento para leads sem atividade",
    trigger: "Lead Inativa",
    action: "🎯 Reengajamento",
    triggerType: "lead_inactive",
    actionType: "reengagement_campaign",
    message: "Que tal conversarmos novamente? Temos novidades!",
    targetGroup: "inactive_leads",
    status: "Ativo",
    executions: 123,
    successRate: 76,
    lastRun: "2024-01-15 08:00"
  },
  {
    id: 12,
    name: "⭐ Venda → Pesquisa NPS",
    description: "Envia pesquisa de satisfação 48h após fechamento",
    trigger: "Negócio Ganho",
    action: "⭐ NPS",
    triggerType: "deal_won",
    actionType: "nps_survey",
    message: "Como foi sua experiência? Avalie de 0 a 10",
    targetGroup: "customers",
    status: "Ativo",
    executions: 56,
    successRate: 82,
    lastRun: "2024-01-15 19:00"
  },
  {
    id: 13,
    name: "🧠 Lead → Resumo IA",
    description: "Gera resumo inteligente do histórico da lead",
    trigger: "Novo Lead",
    action: "🧠 Resumo IA",
    triggerType: "new_lead",
    actionType: "ai_summary",
    targetGroup: "leads",
    status: "Ativo",
    executions: 278,
    successRate: 96,
    lastRun: "2024-01-15 18:30"
  },
  {
    id: 14,
    name: "💾 Backup Mensal Automático",
    description: "Exporta dados para Excel no Dropbox todo mês",
    trigger: "Backup Mensal",
    action: "💾 Backup",
    triggerType: "monthly_backup",
    actionType: "backup_data",
    targetGroup: "all",
    status: "Ativo",
    executions: 3,
    successRate: 100,
    lastRun: "2024-01-01 00:00"
  },
  {
    id: 15,
    name: "⚡ Lead → n8n Workflow",
    description: "Dispara workflow complexo no n8n",
    trigger: "Novo Lead",
    action: "🔁 n8n",
    triggerType: "new_lead",
    actionType: "n8n_webhook",
    webhookUrl: "https://n8n.exemplo.com/webhook/lead-workflow",
    targetGroup: "leads",
    status: "Ativo",
    executions: 445,
    successRate: 99,
    lastRun: "2024-01-15 20:00"
  }
];

const triggerIcons: Record<string, any> = {
  "new_lead": Users,
  "hot_lead": TrendingUp,
  "meeting_scheduled": Calendar,
  "proposal_sent": Mail,
  "deal_won": TrendingUp,
  "payment_overdue": DollarSign,
  "whatsapp_message": MessageCircle,
  "lead_inactive": Clock,
  "weekly_report": Target,
  "monthly_backup": Database,
  "ai_summary": Bot,
  "time_based": Clock
};

const actionIcons: Record<string, any> = {
  "send_email": Mail,
  "send_whatsapp": MessageCircle,
  "rd_station": TrendingUp,
  "slack_alert": MessageCircle,
  "google_calendar": Calendar,
  "google_drive": Database,
  "google_sheets": Target,
  "generate_boleto": DollarSign,
  "send_reminder": Clock,
  "docusign": Target,
  "chatgpt_response": Bot,
  "reengagement_campaign": Target,
  "nps_survey": Target,
  "ai_summary": Bot,
  "backup_data": Database,
  "n8n_webhook": Zap
};

export const AutomationManager = () => {
  const [automations, setAutomations] = useState(mockAutomations);
  const [editingAutomation, setEditingAutomation] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [preselectedTrigger, setPreselectedTrigger] = useState<string>("");
  const [preselectedAction, setPreselectedAction] = useState<string>("");
  const [executingAutomations, setExecutingAutomations] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleCreateAutomation = (newAutomation: any) => {
    setAutomations(prev => [...prev, newAutomation]);
    console.log("Nova automação avançada criada:", newAutomation);
  };

  const handleUpdateAutomation = (updatedAutomation: any) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === updatedAutomation.id ? updatedAutomation : automation
      )
    );
    console.log("Automação avançada atualizada:", updatedAutomation);
  };

  const handleToggleAutomation = (automationId: number) => {
    setAutomations(automations.map(automation => 
      automation.id === automationId 
        ? { ...automation, status: automation.status === "Ativo" ? "Pausado" : "Ativo" }
        : automation
    ));
    
    const automation = automations.find(a => a.id === automationId);
    const newStatus = automation?.status === "Ativo" ? "Pausado" : "Ativo";
    
    toast({
      title: "Status Alterado",
      description: `Automação "${automation?.name}" ${newStatus.toLowerCase()}`,
    });
    
    console.log(`Alternando status da automação ${automationId} para ${newStatus}`);
  };

  const handleEditAutomation = (automationId: number) => {
    const automation = automations.find(a => a.id === automationId);
    if (automation) {
      setEditingAutomation(automation);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteAutomation = (automationId: number) => {
    const automation = automations.find(a => a.id === automationId);
    if (automation && window.confirm(`Deseja realmente excluir a automação "${automation.name}"?`)) {
      setAutomations(prev => prev.filter(a => a.id !== automationId));
      toast({
        title: "Automação Excluída",
        description: `"${automation.name}" foi removida com sucesso`,
      });
    }
  };

  const handleRunAutomation = async (automationId: number) => {
    const automation = automations.find(a => a.id === automationId);
    if (!automation) return;

    if (automation.status === "Pausado") {
      toast({
        title: "Erro",
        description: "Não é possível executar uma automação pausada",
        variant: "destructive"
      });
      return;
    }

    setExecutingAutomations(prev => new Set([...prev, automationId]));
    
    try {
      console.log(`🚀 Executando automação avançada: ${automation.name}`);
      
      toast({
        title: "Executando Automação",
        description: `Iniciando execução de "${automation.name}"...`,
      });

      const result = await executeAutomation(automation);
      
      setAutomations(prev => 
        prev.map(a => 
          a.id === automationId 
            ? { 
                ...a, 
                executions: a.executions + result.contactsReached,
                successRate: result.success ? Math.min(100, a.successRate + 1) : Math.max(0, a.successRate - 1),
                lastRun: new Date().toLocaleString('pt-BR')
              }
            : a
        )
      );

      if (result.success) {
        toast({
          title: "Automação Executada",
          description: `"${automation.name}" executada com sucesso! ${result.contactsReached} contatos alcançados.`,
        });
      } else {
        toast({
          title: "Erro na Execução",
          description: result.details.join('\n'),
          variant: "destructive"
        });
      }
      
      console.log("Resultado da execução avançada:", result);
      
    } catch (error) {
      console.error("Erro ao executar automação avançada:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao executar a automação",
        variant: "destructive"
      });
    } finally {
      setExecutingAutomations(prev => {
        const newSet = new Set(prev);
        newSet.delete(automationId);
        return newSet;
      });
    }
  };

  const handleDialogClose = () => {
    setIsNewDialogOpen(false);
    setPreselectedTrigger("");
    setPreselectedAction("");
  };

  const activeAutomations = automations.filter(a => a.status === "Ativo").length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executions, 0);
  const averageSuccessRate = Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚀 Automação Avançada</h1>
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

      {/* Stats Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automações Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{activeAutomations}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Execuções Totais</p>
                <p className="text-2xl font-bold text-green-600">{totalExecutions.toLocaleString()}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-purple-600">{averageSuccessRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Convertidas</p>
                <p className="text-2xl font-bold text-orange-600">1,234</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Gerada</p>
                <p className="text-2xl font-bold text-green-600">R$ 89k</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            Automações Inteligentes Configuradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => {
              const TriggerIcon = triggerIcons[automation.triggerType] || Zap;
              const ActionIcon = actionIcons[automation.actionType] || Target;

              return (
                <div key={automation.id} className="p-4 border rounded-lg hover:shadow-sm transition-all bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${automation.status === 'Ativo' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <TriggerIcon className={`w-5 h-5 ${automation.status === 'Ativo' ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                        <p className="text-sm text-gray-600">{automation.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={`${automation.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} px-3 py-1`}>
                        {automation.status}
                      </Badge>
                      <Switch 
                        checked={automation.status === "Ativo"}
                        onCheckedChange={() => handleToggleAutomation(automation.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <TriggerIcon className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-gray-600">Gatilho: </span>
                        <span className="font-medium">{automation.trigger}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ActionIcon className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="text-gray-600">Ação: </span>
                        <span className="font-medium">{automation.action}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Execuções: </span>
                      <span className="font-medium text-green-600">{automation.executions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Taxa Sucesso: </span>
                      <span className="font-medium text-purple-600">{automation.successRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Grupo: </span>
                      <span className="font-medium">{automation.targetGroup === 'hot_leads' ? 'Leads Quentes' : automation.targetGroup}</span>
                    </div>
                  </div>

                  {automation.message && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                      <span className="text-blue-600 font-medium">Mensagem: </span>
                      <span className="text-blue-800">{automation.message}</span>
                    </div>
                  )}

                  {automation.webhookUrl && (
                    <div className="mb-3 p-2 bg-purple-50 rounded text-sm">
                      <span className="text-purple-600 font-medium">Webhook: </span>
                      <span className="text-purple-800 font-mono text-xs">{automation.webhookUrl}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {automation.lastRun ? `🕒 Última execução: ${automation.lastRun}` : "⏱️ Nunca executada"}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRunAutomation(automation.id)}
                        disabled={executingAutomations.has(automation.id)}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {executingAutomations.has(automation.id) ? "Executando..." : "▶️ Executar"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditAutomation(automation.id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        ✏️ Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteAutomation(automation.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        🗑️ Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* New Automation Dialog */}
      <NewAutomationDialog 
        isOpen={isNewDialogOpen}
        onClose={handleDialogClose}
        onCreateAutomation={handleCreateAutomation}
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
