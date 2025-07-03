
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Clock, 
  Users, 
  Target,
  Settings,
  BarChart3,
  GitBranch,
  ArrowRight,
  Calendar,
  Tag,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface Automation {
  id: string;
  name: string;
  description: string;
  type: "email" | "whatsapp" | "task" | "tag" | "pipeline";
  trigger: string;
  status: "active" | "paused" | "draft";
  createdAt: string;
  lastRun: string;
  executions: number;
  conversions: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  status: "active" | "paused";
  createdAt: string;
}

interface WorkflowTrigger {
  id: string;
  type: "lead_created" | "stage_changed" | "tag_added" | "email_opened" | "form_submitted";
  conditions: any;
}

interface WorkflowAction {
  id: string;
  type: "send_email" | "send_whatsapp" | "create_task" | "add_tag" | "move_stage" | "wait";
  config: any;
  delay?: number;
}

export const AutomationManager = () => {
  const [activeTab, setActiveTab] = useState("automations");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);

  // Mock data
  const [automations] = useState<Automation[]>([
    {
      id: "1",
      name: "Boas-vindas para Novos Leads",
      description: "Envia email de boas-vindas automaticamente",
      type: "email",
      trigger: "Novo lead criado",
      status: "active",
      createdAt: "2024-01-15",
      lastRun: "2024-01-20 14:30",
      executions: 45,
      conversions: 12
    },
    {
      id: "2",
      name: "Follow-up WhatsApp",
      description: "Mensagem automática após 3 dias sem resposta",
      type: "whatsapp",
      trigger: "Lead sem interação por 3 dias",
      status: "active",
      createdAt: "2024-01-10",
      lastRun: "2024-01-20 09:15",
      executions: 23,
      conversions: 8
    },
    {
      id: "3",
      name: "Tarefa de Qualificação",
      description: "Cria tarefa quando lead avança para qualificação",
      type: "task",
      trigger: "Lead movido para Qualificação",
      status: "paused",
      createdAt: "2024-01-05",
      lastRun: "2024-01-18 16:45",
      executions: 67,
      conversions: 34
    }
  ]);

  const [workflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Nutrição de Leads - Sequência 7 dias",
      description: "Sequência de emails para nutrição de novos leads",
      triggers: [{ id: "1", type: "lead_created", conditions: {} }],
      actions: [
        { id: "1", type: "send_email", config: { template: "welcome" } },
        { id: "2", type: "wait", config: {}, delay: 2 },
        { id: "3", type: "send_email", config: { template: "tips" } },
        { id: "4", type: "wait", config: {}, delay: 3 },
        { id: "5", type: "send_email", config: { template: "case_study" } }
      ],
      status: "active",
      createdAt: "2024-01-15"
    }
  ]);

  const handleCreateAutomation = () => {
    toast.success("Automação criada com sucesso!");
    setIsCreateDialogOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    toast.success("Status da automação alterado!");
  };

  const handleDeleteAutomation = (id: string) => {
    toast.success("Automação excluída com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800", 
      draft: "bg-gray-100 text-gray-800"
    };
    
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      whatsapp: MessageSquare,
      task: Clock,
      tag: Tag,
      pipeline: GitBranch
    };
    
    const Icon = icons[type as keyof typeof icons] || Zap;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automação</h1>
          <p className="text-gray-600 mt-1">Automatize processos e workflows de vendas</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsWorkflowDialogOpen(true)} variant="outline">
            <GitBranch className="w-4 h-4 mr-2" />
            Novo Workflow
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Automação
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Automações Ativas</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Execuções Hoje</p>
                <p className="text-3xl font-bold text-blue-600">248</p>
              </div>
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-purple-600">23.5%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Impactados</p>
                <p className="text-3xl font-bold text-orange-600">1,234</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="automations">Automações</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input placeholder="Buscar automações..." />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Automations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Automações Configuradas</CardTitle>
              <CardDescription>Gerencie suas automações de marketing e vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Gatilho</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Execuções</TableHead>
                    <TableHead>Conversões</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{automation.name}</p>
                          <p className="text-sm text-gray-500">{automation.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(automation.type)}
                          <span className="capitalize">{automation.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{automation.trigger}</TableCell>
                      <TableCell>{getStatusBadge(automation.status)}</TableCell>
                      <TableCell>{automation.executions}</TableCell>
                      <TableCell>{automation.conversions}</TableCell>
                      <TableCell>{automation.lastRun}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(automation.id)}
                          >
                            {automation.status === "active" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflows Visuais</CardTitle>
              <CardDescription>Crie fluxos complexos de automação com múltiplas etapas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <p className="text-gray-600">{workflow.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(workflow.status)}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Workflow Visual */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                        <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg min-w-fit">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Gatilho</span>
                        </div>
                        
                        {workflow.actions.map((action, index) => (
                          <div key={action.id} className="flex items-center gap-4 min-w-fit">
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <div className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg">
                              {action.type === "send_email" && <Mail className="w-4 h-4 text-green-600" />}
                              {action.type === "wait" && <Clock className="w-4 h-4 text-orange-600" />}
                              {action.type === "add_tag" && <Tag className="w-4 h-4 text-purple-600" />}
                              <span className="text-sm">
                                {action.type === "send_email" && "Email"}
                                {action.type === "wait" && `Aguardar ${action.delay}d`}
                                {action.type === "add_tag" && "Tag"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Template Cards */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Sequência de Boas-vindas</h3>
                    <p className="text-sm text-gray-600">3 emails automáticos</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sequência automática para novos leads com apresentação da empresa e produtos.
                </p>
                <Button className="w-full" variant="outline">
                  Usar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Follow-up WhatsApp</h3>
                    <p className="text-sm text-gray-600">Reativação automática</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Mensagens automáticas para leads inativos via WhatsApp Business.
                </p>
                <Button className="w-full" variant="outline">
                  Usar Template
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Qualificação Automática</h3>
                    <p className="text-sm text-gray-600">Score e tarefas</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Sistema de pontuação automática com criação de tarefas para vendedores.
                </p>
                <Button className="w-full" variant="outline">
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance das Automações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Abertura (Email)</span>
                    <span className="font-semibold">34.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de Clique</span>
                    <span className="font-semibold">8.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taxa de Conversão</span>
                    <span className="font-semibold">23.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROI das Automações</span>
                    <span className="font-semibold text-green-600">+340%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execuções por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Hoje</span>
                    <span className="font-semibold">248</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Esta Semana</span>
                    <span className="font-semibold">1,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Este Mês</span>
                    <span className="font-semibold">6,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total</span>
                    <span className="font-semibold">23,891</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Automation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Automação</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Automação</Label>
                <Input id="name" placeholder="Ex: Email de boas-vindas" />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="task">Criação de Tarefa</SelectItem>
                    <SelectItem value="tag">Adição de Tag</SelectItem>
                    <SelectItem value="pipeline">Movimento no Pipeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o objetivo desta automação" />
            </div>

            <div>
              <Label htmlFor="trigger">Gatilho</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Quando executar esta automação?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_created">Novo lead criado</SelectItem>
                  <SelectItem value="stage_changed">Lead mudou de etapa</SelectItem>
                  <SelectItem value="tag_added">Tag adicionada</SelectItem>
                  <SelectItem value="email_opened">Email foi aberto</SelectItem>
                  <SelectItem value="form_submitted">Formulário preenchido</SelectItem>
                  <SelectItem value="no_activity">Sem atividade por X dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" />
              <Label htmlFor="active">Ativar automação imediatamente</Label>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAutomation}>
                Criar Automação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Workflow Dialog */}
      <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Novo Workflow Visual</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workflow-name">Nome do Workflow</Label>
                <Input id="workflow-name" placeholder="Ex: Nutrição de Leads - 7 dias" />
              </div>
              <div>
                <Label htmlFor="workflow-category">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nurturing">Nutrição de Leads</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="reactivation">Reativação</SelectItem>
                    <SelectItem value="upsell">Upsell/Cross-sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="workflow-description">Descrição</Label>
              <Textarea id="workflow-description" placeholder="Descreva o objetivo deste workflow" />
            </div>

            {/* Visual Workflow Builder Preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Constructor Visual de Workflow</h3>
              <p className="text-gray-600 mb-4">
                Arraste e solte elementos para criar seu fluxo de automação
              </p>
              <Button variant="outline">
                Abrir Editor Visual
              </Button>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsWorkflowDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast.success("Workflow criado com sucesso!");
                setIsWorkflowDialogOpen(false);
              }}>
                Criar Workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
