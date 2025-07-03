
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, MessageCircle, Calendar, Clock, Zap, Target, TrendingUp, DollarSign, Bot, Shield, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ADVANCED_TRIGGERS, ADVANCED_ACTIONS } from "@/utils/automationService";

interface NewAutomationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAutomation: (automation: any) => void;
  preselectedTrigger?: string;
  preselectedAction?: string;
}

const triggerCategories = {
  vendas: [
    { id: "new_lead", name: "Novo Lead", icon: Users, description: "Lead criada no CRM" },
    { id: "hot_lead", name: "Lead Quente", icon: TrendingUp, description: "Lead com score maior que 80" },
    { id: "meeting_scheduled", name: "Reunião Agendada", icon: Calendar, description: "Lead agenda reunião" },
    { id: "form_response", name: "Resposta Formulário", icon: Target, description: "Lead responde formulário" },
    { id: "proposal_sent", name: "Proposta Enviada", icon: Mail, description: "Proposta enviada" },
    { id: "deal_won", name: "Negócio Ganho", icon: TrendingUp, description: "Negócio fechado" },
    { id: "deal_lost", name: "Negócio Perdido", icon: Users, description: "Negócio perdido" },
    { id: "proposal_approved", name: "Proposta Aprovada", icon: Target, description: "Cliente aprova proposta" }
  ],
  financeiro: [
    { id: "payment_overdue", name: "Pagamento Atrasado", icon: DollarSign, description: "Cliente em atraso" },
    { id: "new_customer", name: "Novo Cliente", icon: Users, description: "Lead virou cliente" },
    { id: "boleto_request", name: "Solicitação Boleto", icon: DollarSign, description: "Cliente solicita boleto" }
  ],
  comunicacao: [
    { id: "whatsapp_message", name: "Mensagem WhatsApp", icon: MessageCircle, description: "Nova mensagem WhatsApp" },
    { id: "lead_inactive", name: "Lead Inativa", icon: Clock, description: "Lead sem atividade por X dias" },
    { id: "new_whats_lead", name: "Lead WhatsApp", icon: MessageCircle, description: "Nova lead via WhatsApp" }
  ],
  relatorios: [
    { id: "weekly_report", name: "Relatório Semanal", icon: Target, description: "Todo domingo às 9h" },
    { id: "monthly_backup", name: "Backup Mensal", icon: Database, description: "Todo dia 1º do mês" },
    { id: "nps_trigger", name: "Envio NPS", icon: Target, description: "48h após venda" }
  ],
  ia_seguranca: [
    { id: "user_login", name: "Login Usuário", icon: Shield, description: "Login detectado" },
    { id: "ai_summary", name: "Resumo IA", icon: Bot, description: "Gerar resumo inteligente" },
    { id: "lead_update", name: "Atualização Lead", icon: Target, description: "Dados da lead modificados" }
  ],
  tempo: [
    { id: "time_based", name: "Baseado em Tempo", icon: Clock, description: "Executar a cada X tempo" }
  ]
};

const actionCategories = {
  comunicacao: [
    { id: "send_email", name: "Enviar Email", icon: Mail, description: "Email personalizado" },
    { id: "send_whatsapp", name: "Enviar WhatsApp", icon: MessageCircle, description: "Mensagem WhatsApp" },
    { id: "slack_alert", name: "📢 Alerta Slack", icon: MessageCircle, description: "Alerta no Slack" },
    { id: "chatgpt_response", name: "🤖 Resposta IA", icon: Bot, description: "Resposta via ChatGPT" }
  ],
  vendas: [
    { id: "schedule_meeting", name: "Agendar Reunião", icon: Calendar, description: "Criar evento" },
    { id: "assign_user", name: "Atribuir Usuário", icon: Users, description: "Atribuir lead" },
    { id: "google_calendar", name: "📅 Google Calendar", icon: Calendar, description: "Evento no Google Calendar" },
    { id: "reengagement_campaign", name: "🎯 Campanha Reengajamento", icon: Target, description: "Reativar leads inativas" }
  ],
  marketing: [
    { id: "rd_station", name: "📊 RD Station", icon: TrendingUp, description: "Enviar para RD Station" },
    { id: "active_campaign", name: "📧 ActiveCampaign", icon: Mail, description: "Enviar para ActiveCampaign" },
    { id: "mailchimp_sync", name: "📬 Mailchimp", icon: Mail, description: "Sincronizar Mailchimp" },
    { id: "klaviyo_sync", name: "📨 Klaviyo", icon: Mail, description: "Sincronizar Klaviyo" }
  ],
  financeiro: [
    { id: "generate_boleto", name: "💰 Gerar Boleto", icon: DollarSign, description: "Boleto ASAAS/Iugu" },
    { id: "send_reminder", name: "⏰ Lembrete Cobrança", icon: Clock, description: "Lembrete pagamento" },
    { id: "erp_integration", name: "🏢 Integração ERP", icon: Database, description: "Cadastrar no ERP" }
  ],
  documentos: [
    { id: "docusign", name: "📝 DocuSign", icon: Target, description: "Assinatura DocuSign" },
    { id: "clicksign", name: "✍️ ClickSign", icon: Target, description: "Assinatura ClickSign" },
    { id: "google_drive", name: "📁 Google Drive", icon: Database, description: "Salvar no Google Drive" }
  ],
  relatorios: [
    { id: "google_sheets", name: "📊 Google Sheets", icon: Target, description: "Atualizar planilha" },
    { id: "airtable", name: "🗃️ Airtable", icon: Database, description: "Sincronizar Airtable" },
    { id: "backup_data", name: "💾 Backup Dados", icon: Database, description: "Backup automático" }
  ],
  automacao: [
    { id: "zapier_webhook", name: "🔁 Zapier", icon: Zap, description: "Webhook Zapier" },
    { id: "make_webhook", name: "🔁 Make.com", icon: Zap, description: "Webhook Make.com" },
    { id: "n8n_webhook", name: "🔁 n8n", icon: Zap, description: "Webhook n8n" },
    { id: "pabbly_webhook", name: "🔁 Pabbly", icon: Zap, description: "Webhook Pabbly" }
  ],
  ia_outros: [
    { id: "nps_survey", name: "⭐ Pesquisa NPS", icon: Target, description: "Enviar NPS" },
    { id: "ai_summary", name: "🧠 Resumo IA", icon: Bot, description: "Resumo inteligente" },
    { id: "security_log", name: "🔐 Log Segurança", icon: Shield, description: "Registrar atividade" }
  ]
};

export const NewAutomationDialog = ({ 
  isOpen, 
  onClose, 
  onCreateAutomation, 
  preselectedTrigger = "", 
  preselectedAction = "" 
}: NewAutomationDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    message: "",
    delay: "",
    targetGroup: "all",
    webhookUrl: ""
  });
  const [selectedTriggerCategory, setSelectedTriggerCategory] = useState<string>("vendas");
  const [selectedActionCategory, setSelectedActionCategory] = useState<string>("comunicacao");
  const { toast } = useToast();

  useEffect(() => {
    if (preselectedTrigger) {
      setFormData(prev => ({ ...prev, trigger: preselectedTrigger }));
    }
    if (preselectedAction) {
      setFormData(prev => ({ ...prev, action: preselectedAction }));
    }
  }, [preselectedTrigger, preselectedAction]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.trigger || !formData.action) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Validar se webhook URL é necessária
    const webhookActions = ["zapier_webhook", "make_webhook", "n8n_webhook", "pabbly_webhook", "rd_station", "active_campaign"];
    if (webhookActions.includes(formData.action) && !formData.webhookUrl) {
      toast({
        title: "Erro",
        description: "URL do webhook é obrigatória para esta ação",
        variant: "destructive"
      });
      return;
    }

    const newAutomation = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      trigger: getTriggerName(formData.trigger),
      action: getActionName(formData.action),
      triggerType: formData.trigger,
      actionType: formData.action,
      message: formData.message,
      delay: formData.delay,
      targetGroup: formData.targetGroup,
      webhookUrl: formData.webhookUrl,
      status: "Ativo",
      executions: 0,
      successRate: 0,
      lastRun: null,
      createdAt: new Date().toISOString()
    };

    console.log("Criando nova automação avançada:", newAutomation);
    onCreateAutomation(newAutomation);

    toast({
      title: "Sucesso",
      description: `Automação "${formData.name}" criada com sucesso`,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      trigger: "",
      action: "",
      message: "",
      delay: "",
      targetGroup: "all",
      webhookUrl: ""
    });
    onClose();
  };

  const getTriggerName = (triggerId: string) => {
    for (const category of Object.values(triggerCategories)) {
      const trigger = category.find(t => t.id === triggerId);
      if (trigger) return trigger.name;
    }
    return triggerId;
  };

  const getActionName = (actionId: string) => {
    for (const category of Object.values(actionCategories)) {
      const action = category.find(a => a.id === actionId);
      if (action) return action.name;
    }
    return actionId;
  };

  const isWebhookAction = ["zapier_webhook", "make_webhook", "n8n_webhook", "pabbly_webhook", "rd_station", "active_campaign"].includes(formData.action);
  const isMessageAction = ["send_email", "send_whatsapp", "chatgpt_response", "slack_alert"].includes(formData.action);
  const isTimeBasedTrigger = ["time_based", "weekly_report", "monthly_backup"].includes(formData.trigger);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🚀 Nova Automação Avançada</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Automação *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Lead Quente → Alerta Slack"
                required
              />
            </div>
            <div>
              <Label htmlFor="targetGroup">Grupo Alvo</Label>
              <Select value={formData.targetGroup} onValueChange={(value) => handleInputChange("targetGroup", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Contatos</SelectItem>
                  <SelectItem value="leads">Apenas Leads</SelectItem>
                  <SelectItem value="hot_leads">Leads Quentes (Score maior que 80)</SelectItem>
                  <SelectItem value="customers">Apenas Clientes</SelectItem>
                  <SelectItem value="prospects">Apenas Prospects</SelectItem>
                  <SelectItem value="inactive_leads">Leads Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o que esta automação faz..."
              rows={2}
            />
          </div>

          {/* Seleção de Gatilho */}
          <div className="space-y-4">
            <Label>Gatilho (Quando executar) *</Label>
            
            {/* Categorias de Gatilho */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(triggerCategories).map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedTriggerCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTriggerCategory(category)}
                >
                  {category === "vendas" && "📈 Vendas"}
                  {category === "financeiro" && "💰 Financeiro"}
                  {category === "comunicacao" && "💬 Comunicação"}
                  {category === "relatorios" && "📊 Relatórios"}
                  {category === "ia_seguranca" && "🤖 IA & Segurança"}
                  {category === "tempo" && "⏰ Tempo"}
                </Button>
              ))}
            </div>

            {/* Gatilhos da Categoria Selecionada */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {triggerCategories[selectedTriggerCategory as keyof typeof triggerCategories]?.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <div
                    key={trigger.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.trigger === trigger.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleInputChange("trigger", trigger.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{trigger.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{trigger.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seleção de Ação */}
          <div className="space-y-4">
            <Label>Ação (O que fazer) *</Label>
            
            {/* Categorias de Ação */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(actionCategories).map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedActionCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedActionCategory(category)}
                >
                  {category === "comunicacao" && "💬 Comunicação"}
                  {category === "vendas" && "📈 Vendas"}
                  {category === "marketing" && "📊 Marketing"}
                  {category === "financeiro" && "💰 Financeiro"}
                  {category === "documentos" && "📄 Documentos"}
                  {category === "relatorios" && "📋 Relatórios"}
                  {category === "automacao" && "🔁 Automação"}
                  {category === "ia_outros" && "🤖 IA & Outros"}
                </Button>
              ))}
            </div>

            {/* Ações da Categoria Selecionada */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {actionCategories[selectedActionCategory as keyof typeof actionCategories]?.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.action === action.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => handleInputChange("action", action.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{action.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configurações Específicas */}
          {isWebhookAction && (
            <div>
              <Label htmlFor="webhookUrl">URL do Webhook *</Label>
              <Input
                id="webhookUrl"
                value={formData.webhookUrl}
                onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole aqui a URL do webhook da sua plataforma de automação
              </p>
            </div>
          )}

          {isMessageAction && (
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Digite a mensagem que será enviada... Use {nome} e {empresa} para personalizar."
                rows={3}
              />
            </div>
          )}

          {isTimeBasedTrigger && (
            <div>
              <Label htmlFor="delay">Intervalo (minutos)</Label>
              <Input
                id="delay"
                type="number"
                value={formData.delay}
                onChange={(e) => handleInputChange("delay", e.target.value)}
                placeholder="Ex: 1440 (24 horas)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para automações baseadas em tempo (padrão: 24h)
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
              🚀 Criar Automação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
