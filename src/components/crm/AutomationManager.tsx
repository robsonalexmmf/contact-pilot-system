
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Play,
  Pause,
  Settings,
  Mail,
  MessageCircle,
  Calendar,
  Users,
  Target,
  Clock
} from "lucide-react";

const mockAutomations = [
  {
    id: 1,
    name: "Welcome Email para Novos Leads",
    description: "Envia email de boas-vindas automaticamente para novos leads",
    trigger: "Novo Lead Criado",
    action: "Enviar Email",
    status: "Ativo",
    executions: 245,
    successRate: 98,
    lastRun: "2024-01-15 14:30"
  },
  {
    id: 2,
    name: "Follow-up WhatsApp 24h",
    description: "Envia mensagem no WhatsApp após 24h sem resposta",
    trigger: "Lead sem Resposta 24h",
    action: "Enviar WhatsApp",
    status: "Ativo",
    executions: 156,
    successRate: 87,
    lastRun: "2024-01-15 12:15"
  },
  {
    id: 3,
    name: "Agendamento Automático",
    description: "Agenda reunião automaticamente após interesse confirmado",
    trigger: "Lead Qualificado",
    action: "Agendar Reunião",
    status: "Pausado",
    executions: 78,
    successRate: 92,
    lastRun: "2024-01-14 16:45"
  }
];

const triggerTypes = [
  { id: "new_lead", name: "Novo Lead", icon: Users },
  { id: "email_opened", name: "Email Aberto", icon: Mail },
  { id: "form_submitted", name: "Formulário Enviado", icon: Target },
  { id: "time_based", name: "Baseado em Tempo", icon: Clock }
];

const actionTypes = [
  { id: "send_email", name: "Enviar Email", icon: Mail },
  { id: "send_whatsapp", name: "Enviar WhatsApp", icon: MessageCircle },
  { id: "schedule_meeting", name: "Agendar Reunião", icon: Calendar },
  { id: "assign_user", name: "Atribuir Usuário", icon: Users }
];

export const AutomationManager = () => {
  const [automations, setAutomations] = useState(mockAutomations);

  const handleNewAutomation = () => {
    console.log("Criando nova automação...");
  };

  const handleToggleAutomation = (automationId: number) => {
    setAutomations(automations.map(automation => 
      automation.id === automationId 
        ? { ...automation, status: automation.status === "Ativo" ? "Pausado" : "Ativo" }
        : automation
    ));
    console.log(`Alternando status da automação ${automationId}...`);
  };

  const handleEditAutomation = (automationId: number) => {
    console.log(`Editando automação ${automationId}...`);
  };

  const handleRunAutomation = (automationId: number) => {
    console.log(`Executando automação ${automationId}...`);
  };

  const activeAutomations = automations.filter(a => a.status === "Ativo").length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executions, 0);
  const averageSuccessRate = Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automação</h1>
          <p className="text-gray-600">Configure automações para otimizar seu workflow</p>
        </div>
        <Button onClick={handleNewAutomation} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold text-green-600">{totalExecutions}</p>
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
                <p className="text-sm font-medium text-gray-600">Tempo Economizado</p>
                <p className="text-2xl font-bold text-orange-600">18h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <CardTitle>Automações Configuradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${automation.status === 'Ativo' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Zap className={`w-5 h-5 ${automation.status === 'Ativo' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                      <p className="text-sm text-gray-600">{automation.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={automation.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {automation.status}
                    </Badge>
                    <Switch 
                      checked={automation.status === "Ativo"}
                      onCheckedChange={() => handleToggleAutomation(automation.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Gatilho: </span>
                    <span className="font-medium">{automation.trigger}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ação: </span>
                    <span className="font-medium">{automation.action}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Execuções: </span>
                    <span className="font-medium">{automation.executions}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Taxa Sucesso: </span>
                    <span className="font-medium text-green-600">{automation.successRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Última execução: {automation.lastRun}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleRunAutomation(automation.id)}>
                      <Play className="w-4 h-4 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditAutomation(automation.id)}>
                      <Settings className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gatilhos Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {triggerTypes.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <div key={trigger.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">{trigger.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {actionTypes.map((action) => {
                const Icon = action.icon;
                return (
                  <div key={action.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
