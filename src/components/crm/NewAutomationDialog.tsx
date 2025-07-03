
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Users,
  Target,
  BarChart3,
  Shield,
  Phone,
  Send,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  FileText,
  Package,
  Database
} from "lucide-react";

interface NewAutomationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (automation: any) => void;
}

const advancedAutomations = [
  {
    id: 'lead-scoring',
    name: 'Score Automático de Leads',
    description: 'Classifica leads automaticamente baseado em critérios',
    category: 'vendas',
    icon: Target,
    triggers: ['Novo lead', 'Lead atualizado', 'Atividade do lead'],
    actions: ['Atualizar score', 'Mover pipeline', 'Notificar vendedor'],
    complexity: 'Avançado'
  },
  {
    id: 'follow-up-sequence',
    name: 'Sequência de Follow-up',
    description: 'Envia follow-ups automáticos em intervalos definidos',
    category: 'comunicacao',
    icon: MessageSquare,
    triggers: ['Lead inativo', 'Sem resposta', 'Data específica'],
    actions: ['Enviar email', 'WhatsApp', 'Criar tarefa'],
    complexity: 'Intermediário'
  },
  {
    id: 'revenue-forecast',
    name: 'Previsão de Receita',
    description: 'Calcula previsões de receita baseado no pipeline',
    category: 'financeiro',
    icon: DollarSign,
    triggers: ['Deal atualizado', 'Nova oportunidade', 'Mudança de estágio'],
    actions: ['Calcular previsão', 'Gerar relatório', 'Alertar gerente'],
    complexity: 'Avançado'
  },
  {
    id: 'meeting-scheduler',
    name: 'Agendador Inteligente',
    description: 'Agenda reuniões automaticamente baseado em disponibilidade',
    category: 'produtividade',
    icon: Calendar,
    triggers: ['Lead qualificado', 'Solicitação de reunião', 'Follow-up'],
    actions: ['Verificar agenda', 'Enviar convite', 'Criar evento'],
    complexity: 'Avançado'
  },
  {
    id: 'customer-segmentation',
    name: 'Segmentação de Clientes',
    description: 'Segmenta clientes automaticamente por comportamento',
    category: 'marketing',
    icon: Users,
    triggers: ['Nova compra', 'Atividade no site', 'Engajamento'],
    actions: ['Criar segmento', 'Aplicar tag', 'Personalizar campanha'],
    complexity: 'Avançado'
  },
  {
    id: 'churn-prediction',
    name: 'Predição de Churn',
    description: 'Identifica clientes com risco de cancelamento',
    category: 'retenção',
    icon: AlertTriangle,
    triggers: ['Baixo engajamento', 'Reclamação', 'Uso reduzido'],
    actions: ['Alertar CS', 'Oferecer desconto', 'Agendar call'],
    complexity: 'Avançado'
  },
  {
    id: 'cross-sell-upsell',
    name: 'Cross-sell e Upsell',
    description: 'Identifica oportunidades de venda adicional',
    category: 'vendas',
    icon: TrendingUp,
    triggers: ['Compra realizada', 'Uso do produto', 'Renovação'],
    actions: ['Sugerir produto', 'Criar oportunidade', 'Notificar vendedor'],
    complexity: 'Avançado'
  },
  {
    id: 'support-ticket-routing',
    name: 'Roteamento de Tickets',
    description: 'Distribui tickets de suporte automaticamente',
    category: 'suporte',
    icon: Shield,
    triggers: ['Novo ticket', 'Escalação', 'Categoria específica'],
    actions: ['Atribuir agente', 'Definir prioridade', 'SLA'],
    complexity: 'Intermediário'
  },
  {
    id: 'social-listening',
    name: 'Monitoramento Social',
    description: 'Monitora menções da marca nas redes sociais',  
    category: 'marketing',
    icon: Globe,
    triggers: ['Menção da marca', 'Hashtag específica', 'Concorrente'],
    actions: ['Criar lead', 'Alertar marketing', 'Responder automaticamente'],
    complexity: 'Avançado'
  },
  {
    id: 'invoice-automation',
    name: 'Automação de Faturas',
    description: 'Gera e envia faturas automaticamente',
    category: 'financeiro', 
    icon: FileText,
    triggers: ['Deal fechado', 'Renovação', 'Data de cobrança'],
    actions: ['Gerar fatura', 'Enviar por email', 'Atualizar sistema'],
    complexity: 'Intermediário'
  },
  {
    id: 'performance-alerts',
    name: 'Alertas de Performance',
    description: 'Monitora KPIs e envia alertas quando necessário',
    category: 'relatorios',
    icon: BarChart3,
    triggers: ['Meta não atingida', 'Queda de conversão', 'Aumento de custos'],
    actions: ['Enviar alerta', 'Gerar relatório', 'Notificar gestores'],
    complexity: 'Avançado'
  },
  {
    id: 'lead-nurturing',
    name: 'Nutrição de Leads',
    description: 'Nutre leads com conteúdo personalizado',
    category: 'marketing',
    icon: Star,
    triggers: ['Interesse demonstrado', 'Download de material', 'Página visitada'],
    actions: ['Enviar conteúdo', 'Agendar follow-up', 'Pontuação'],
    complexity: 'Avançado'
  },
  {
    id: 'competitor-monitoring',
    name: 'Monitoramento de Concorrência',
    description: 'Monitora atividades e preços dos concorrentes',
    category: 'inteligencia',
    icon: Target,
    triggers: ['Mudança de preço', 'Novo produto', 'Campanha lançada'],
    actions: ['Alertar equipe', 'Ajustar preços', 'Criar relatório'],
    complexity: 'Avançado'
  },
  {
    id: 'event-triggered-campaigns',
    name: 'Campanhas por Eventos',
    description: 'Dispara campanhas baseadas em eventos específicos',
    category: 'marketing',
    icon: Zap,
    triggers: ['Aniversário', 'Data comemorativa', 'Milestone atingido'],
    actions: ['Enviar campanha', 'Oferecer desconto', 'Personalizar mensagem'],
    complexity: 'Intermediário'
  },
  {
    id: 'quality-assurance',
    name: 'Controle de Qualidade',
    description: 'Monitora qualidade do atendimento automaticamente',
    category: 'qualidade',
    icon: CheckCircle,
    triggers: ['Ticket resolvido', 'Chamada finalizada', 'Feedback recebido'],
    actions: ['Avaliar qualidade', 'Gerar score', 'Alertar supervisor'],
    complexity: 'Avançado'
  },
  {
    id: 'inventory-management',
    name: 'Gestão de Estoque',
    description: 'Controla estoque e reposição automaticamente',
    category: 'operacional',
    icon: Package,
    triggers: ['Estoque baixo', 'Produto vendido', 'Prazo de validade'],
    actions: ['Fazer pedido', 'Alertar compras', 'Atualizar sistema'],
    complexity: 'Intermediário'
  },
  {
    id: 'sentiment-analysis',
    name: 'Análise de Sentimento',
    description: 'Analisa sentimento em interações com clientes',
    category: 'inteligencia',
    icon: Bot,
    triggers: ['Mensagem recebida', 'Review publicado', 'Feedback dado'],
    actions: ['Classificar sentimento', 'Alertar se negativo', 'Priorizar atendimento'],
    complexity: 'Avançado'
  },
  {
    id: 'appointment-reminders',
    name: 'Lembretes de Compromissos',
    description: 'Envia lembretes automáticos de compromissos',
    category: 'produtividade',
    icon: Clock,
    triggers: ['24h antes', '1h antes', 'Agendamento criado'],
    actions: ['Enviar SMS', 'Email lembrete', 'Notificação push'],
    complexity: 'Básico'
  },
  {
    id: 'data-enrichment',
    name: 'Enriquecimento de Dados',
    description: 'Enriquece dados de leads automaticamente',
    category: 'dados',
    icon: Database,
    triggers: ['Novo lead', 'Dados incompletos', 'Atualização necessária'],
    actions: ['Buscar informações', 'Atualizar perfil', 'Verificar dados'],
    complexity: 'Avançado'
  },
  {
    id: 'multi-channel-sync',
    name: 'Sincronização Multi-canal',
    description: 'Sincroniza dados entre diferentes canais',
    category: 'integração',
    icon: Smartphone,
    triggers: ['Nova interação', 'Canal mudou', 'Dados atualizados'],
    actions: ['Sincronizar dados', 'Atualizar histórico', 'Consolidar perfil'],
    complexity: 'Avançado'
  }
];

const categoryIcons = {
  vendas: Target,
  comunicacao: MessageSquare,
  financeiro: DollarSign,
  produtividade: Calendar,
  marketing: Users,
  retenção: AlertTriangle,
  suporte: Shield,
  relatorios: BarChart3,
  inteligencia: Bot,
  qualidade: CheckCircle,
  operacional: Package,
  dados: Database,
  integração: Smartphone
};

const categoryColors = {
  vendas: 'bg-green-100 text-green-800',
  comunicacao: 'bg-blue-100 text-blue-800',
  financeiro: 'bg-yellow-100 text-yellow-800',
  produtividade: 'bg-purple-100 text-purple-800',
  marketing: 'bg-pink-100 text-pink-800',
  retenção: 'bg-red-100 text-red-800',
  suporte: 'bg-indigo-100 text-indigo-800',
  relatorios: 'bg-orange-100 text-orange-800',
  inteligencia: 'bg-cyan-100 text-cyan-800',
  qualidade: 'bg-emerald-100 text-emerald-800',
  operacional: 'bg-slate-100 text-slate-800',
  dados: 'bg-violet-100 text-violet-800',
  integração: 'bg-teal-100 text-teal-800'
};

export const NewAutomationDialog = ({ open, onClose, onSave }: NewAutomationDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: '',
    action_type: '',
    message: '',
    delay_minutes: 0,
    target_group: 'all',
    webhook_url: ''
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = advancedAutomations.find(a => a.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData({
        ...formData,
        name: template.name,
        description: template.description,
        trigger_type: template.triggers[0],
        action_type: template.actions[0]
      });
    }
  };

  const handleSave = () => {
    const automation = {
      ...formData,
      template: selectedTemplate,
      status: 'active',
      executions: 0,
      success_rate: 0
    };
    onSave(automation);
    setFormData({
      name: '',
      description: '',
      trigger_type: '',
      action_type: '',
      message: '',
      delay_minutes: 0,
      target_group: 'all',
      webhook_url: ''
    });
    setSelectedTemplate('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Nova Automação Avançada
          </DialogTitle>
          <DialogDescription>
            Escolha um template de automação ou crie uma personalizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Templates de Automação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Templates Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {advancedAutomations.map((automation) => {
                const Icon = automation.icon;
                const CategoryIcon = categoryIcons[automation.category as keyof typeof categoryIcons];
                
                return (
                  <Card 
                    key={automation.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === automation.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTemplateSelect(automation.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <CardTitle className="text-sm">{automation.name}</CardTitle>
                        </div>
                        <Badge className={categoryColors[automation.category as keyof typeof categoryColors]}>
                          {automation.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {automation.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600">Triggers:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {automation.triggers.slice(0, 2).map((trigger, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                            {automation.triggers.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{automation.triggers.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={automation.complexity === 'Avançado' ? 'destructive' : 
                                        automation.complexity === 'Intermediário' ? 'default' : 'secondary'}>
                            {automation.complexity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Formulário de Configuração */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuração da Automação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Automação</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Follow-up automático"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Tipo de Trigger</Label>
                <Select value={formData.trigger_type} onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_lead">Novo Lead</SelectItem>
                    <SelectItem value="deal_updated">Deal Atualizado</SelectItem>
                    <SelectItem value="task_completed">Tarefa Concluída</SelectItem>
                    <SelectItem value="time_based">Baseado em Tempo</SelectItem>
                    <SelectItem value="email_opened">Email Aberto</SelectItem>
                    <SelectItem value="form_submitted">Formulário Enviado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Tipo de Ação</Label>
                <Select value={formData.action_type} onValueChange={(value) => setFormData({ ...formData, action_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_email">Enviar Email</SelectItem>
                    <SelectItem value="send_whatsapp">Enviar WhatsApp</SelectItem>
                    <SelectItem value="create_task">Criar Tarefa</SelectItem>
                    <SelectItem value="update_deal">Atualizar Deal</SelectItem>
                    <SelectItem value="assign_lead">Atribuir Lead</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delay">Delay (minutos)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={formData.delay_minutes}
                  onChange={(e) => setFormData({ ...formData, delay_minutes: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o que esta automação faz..."
                rows={3}
              />
            </div>

            {(formData.action_type === 'send_email' || formData.action_type === 'send_whatsapp') && (
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Digite a mensagem que será enviada..."
                  rows={4}
                />
              </div>
            )}

            {formData.action_type === 'webhook' && (
              <div className="space-y-2">
                <Label htmlFor="webhook">URL do Webhook</Label>
                <Input
                  id="webhook"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  placeholder="https://exemplo.com/webhook"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="target">Grupo Alvo</Label>
              <Select value={formData.target_group} onValueChange={(value) => setFormData({ ...formData, target_group: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo alvo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Leads</SelectItem>
                  <SelectItem value="hot">Leads Quentes</SelectItem>
                  <SelectItem value="cold">Leads Frios</SelectItem>
                  <SelectItem value="customers">Clientes</SelectItem>
                  <SelectItem value="prospects">Prospects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview da Automação */}
          {selectedTemplate && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Preview da Automação:</h4>
              <p className="text-sm text-gray-600">
                Quando <strong>{formData.trigger_type}</strong> acontecer, 
                {formData.delay_minutes > 0 && ` aguardar ${formData.delay_minutes} minutos e então `}
                executar <strong>{formData.action_type}</strong> 
                {formData.target_group !== 'all' && ` para ${formData.target_group}`}.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || !formData.trigger_type || !formData.action_type}
            >
              <Zap className="w-4 h-4 mr-2" />
              Criar Automação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
