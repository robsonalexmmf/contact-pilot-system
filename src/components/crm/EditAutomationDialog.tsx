
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, MessageCircle, Calendar, Clock, Zap, Target, TrendingUp, DollarSign, Bot, Shield, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditAutomationDialogProps {
  automation: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAutomation: (automation: any) => void;
}

const triggerCategories = {
  vendas: [
    { id: "new_lead", name: "Novo Lead", icon: Users },
    { id: "hot_lead", name: "Lead Quente", icon: TrendingUp },
    { id: "meeting_scheduled", name: "Reunião Agendada", icon: Calendar },
    { id: "form_response", name: "Resposta Formulário", icon: Target },
    { id: "proposal_sent", name: "Proposta Enviada", icon: Mail },
    { id: "deal_won", name: "Negócio Ganho", icon: TrendingUp },
    { id: "proposal_approved", name: "Proposta Aprovada", icon: Target }
  ],
  financeiro: [
    { id: "payment_overdue", name: "Pagamento Atrasado", icon: DollarSign }
  ],
  comunicacao: [
    { id: "whatsapp_message", name: "Mensagem WhatsApp", icon: MessageCircle },
    { id: "lead_inactive", name: "Lead Inativa", icon: Clock }
  ],
  relatorios: [
    { id: "weekly_report", name: "Relatório Semanal", icon: Target },
    { id: "monthly_backup", name: "Backup Mensal", icon: Database },
    { id: "nps_trigger", name: "Envio NPS", icon: Target }
  ],
  outros: [
    { id: "user_login", name: "Login Usuário", icon: Shield },
    { id: "ai_summary", name: "Resumo IA", icon: Bot },
    { id: "time_based", name: "Baseado em Tempo", icon: Clock }
  ]
};

const actionCategories = {
  comunicacao: [
    { id: "send_email", name: "Enviar Email", icon: Mail },
    { id: "send_whatsapp", name: "Enviar WhatsApp", icon: MessageCircle },
    { id: "slack_alert", name: "📢 Alerta Slack", icon: MessageCircle },
    { id: "chatgpt_response", name: "🤖 Resposta IA", icon: Bot }
  ],
  vendas: [
    { id: "schedule_meeting", name: "Agendar Reunião", icon: Calendar },
    { id: "assign_user", name: "Atribuir Usuário", icon: Users },
    { id: "google_calendar", name: "📅 Google Calendar", icon: Calendar },
    { id: "reengagement_campaign", name: "🎯 Reengajamento", icon: Target }
  ],
  marketing: [
    { id: "rd_station", name: "📊 RD Station", icon: TrendingUp },
    { id: "active_campaign", name: "📧 ActiveCampaign", icon: Mail },
    { id: "mailchimp_sync", name: "📬 Mailchimp", icon: Mail },
    { id: "klaviyo_sync", name: "📨 Klaviyo", icon: Mail }
  ],
  financeiro: [
    { id: "generate_boleto", name: "💰 Gerar Boleto", icon: DollarSign },
    { id: "send_reminder", name: "⏰ Lembrete", icon: Clock },
    { id: "erp_integration", name: "🏢 ERP", icon: Database }
  ],
  automacao: [
    { id: "zapier_webhook", name: "🔁 Zapier", icon: Zap },
    { id: "make_webhook", name: "🔁 Make.com", icon: Zap },
    { id: "n8n_webhook", name: "🔁 n8n", icon: Zap },
    { id: "pabbly_webhook", name: "🔁 Pabbly", icon: Zap }
  ],
  outros: [
    { id: "docusign", name: "📝 DocuSign", icon: Target },
    { id: "clicksign", name: "✍️ ClickSign", icon: Target },
    { id: "google_drive", name: "📁 Google Drive", icon: Database },
    { id: "google_sheets", name: "📊 Google Sheets", icon: Target },
    { id: "airtable", name: "🗃️ Airtable", icon: Database },
    { id: "nps_survey", name: "⭐ NPS", icon: Target },
    { id: "ai_summary", name: "🧠 Resumo IA", icon: Bot },
    { id: "security_log", name: "🔐 Log", icon: Shield },
    { id: "backup_data", name: "💾 Backup", icon: Database }
  ]
};

export const EditAutomationDialog = ({ automation, isOpen, onClose, onUpdateAutomation }: EditAutomationDialogProps) => {
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
  const { toast } = useToast();

  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name || "",
        description: automation.description || "",
        trigger: automation.triggerType || "",
        action: automation.actionType || "",
        message: automation.message || "",
        delay: automation.delay || "",
        targetGroup: automation.targetGroup || "all",
        webhookUrl: automation.webhookUrl || ""
      });
    }
  }, [automation]);

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

    const updatedAutomation = {
      ...automation,
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
      updatedAt: new Date().toISOString()
    };

    console.log("Atualizando automação:", updatedAutomation);
    onUpdateAutomation(updatedAutomation);

    toast({
      title: "Sucesso",
      description: `Automação "${formData.name}" atualizada com sucesso`,
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

  if (!automation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ Editar Automação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  <SelectItem value="hot_leads">Leads Quentes</SelectItem>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trigger">Gatilho *</Label>
              <Select value={formData.trigger} onValueChange={(value) => handleInputChange("trigger", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gatilho" />
                </SelectTrigger>
                <SelectContent>
                  <optgroup label="📈 Vendas & Leads">
                    {triggerCategories.vendas.map((trigger) => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="💰 Financeiro">
                    {triggerCategories.financeiro.map((trigger) => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="💬 Comunicação">
                    {triggerCategories.comunicacao.map((trigger) => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="📊 Relatórios">
                    {triggerCategories.relatorios.map((trigger) => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="🤖 Outros">
                    {triggerCategories.outros.map((trigger) => (
                      <SelectItem key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action">Ação *</Label>
              <Select value={formData.action} onValueChange={(value) => handleInputChange("action", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ação" />
                </SelectTrigger>
                <SelectContent>
                  <optgroup label="💬 Comunicação">
                    {actionCategories.comunicacao.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="📈 Vendas">
                    {actionCategories.vendas.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="📊 Marketing">
                    {actionCategories.marketing.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="💰 Financeiro">
                    {actionCategories.financeiro.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="🔁 Automação">
                    {actionCategories.automacao.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                  <optgroup label="🤖 Outros">
                    {actionCategories.outros.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </optgroup>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                Cole aqui a URL do webhook da sua plataforma
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
                placeholder="Digite a mensagem... Use {nome} e {empresa} para personalizar."
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
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
