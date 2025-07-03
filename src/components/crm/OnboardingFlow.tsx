
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  CheckCircle,
  Users,
  Target,
  Settings,
  PlayCircle,
  Book,
  Star
} from "lucide-react";

const onboardingSteps = [
  {
    id: 1,
    title: "Configuração Inicial",
    description: "Configure sua empresa e perfil",
    status: "completed",
    duration: "5 min"
  },
  {
    id: 2,
    title: "Primeiro Lead",
    description: "Cadastre seu primeiro lead no sistema",
    status: "completed",
    duration: "3 min"
  },
  {
    id: 3,
    title: "Criação do Funil",
    description: "Monte seu pipeline de vendas",
    status: "current",
    duration: "8 min"
  },
  {
    id: 4,
    title: "Integração WhatsApp",
    description: "Conecte suas redes sociais",
    status: "pending",
    duration: "10 min"
  },
  {
    id: 5,
    title: "Primeira Automação",
    description: "Configure uma automação básica",
    status: "pending",
    duration: "12 min"
  }
];

const trainingModules = [
  {
    id: 1,
    title: "Fundamentos do CRM",
    lessons: 8,
    duration: "45 min",
    completed: true
  },
  {
    id: 2,
    title: "Gestão de Leads",
    lessons: 6,
    duration: "35 min",
    completed: true
  },
  {
    id: 3,
    title: "Automação de Vendas",
    lessons: 10,
    duration: "60 min",
    completed: false
  },
  {
    id: 4,
    title: "Relatórios Avançados",
    lessons: 5,
    duration: "30 min",
    completed: false
  }
];

export const OnboardingFlow = () => {
  const [steps] = useState(onboardingSteps);
  const [modules] = useState(trainingModules);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "current":
        return <PlayCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding & Treinamento</h1>
          <p className="text-gray-600">Guia completo para dominar o CRM</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Rocket className="w-4 h-4 mr-2" />
          Continuar Onboarding
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-blue-600">40%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Etapas Concluídas</p>
                <p className="text-2xl font-bold text-green-600">2/5</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Estimado</p>
                <p className="text-2xl font-bold text-purple-600">23 min</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificações</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="w-5 h-5 mr-2" />
            Primeiros Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <Badge className={getStepColor(step.status)}>
                      {step.status === "completed" && "Concluído"}
                      {step.status === "current" && "Atual"}
                      {step.status === "pending" && "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Duração estimada: {step.duration}</p>
                </div>
                <div className="flex-shrink-0">
                  {step.status === "current" ? (
                    <Button size="sm" className="bg-blue-600">
                      Continuar
                    </Button>
                  ) : step.status === "pending" ? (
                    <Button size="sm" variant="outline">
                      Iniciar
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost">
                      Revisar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="w-5 h-5 mr-2" />
            Módulos de Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.lessons} aulas • {module.duration}</p>
                  </div>
                  {module.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${module.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: module.completed ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant={module.completed ? "outline" : "default"}
                  className={!module.completed ? "bg-blue-600" : ""}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {module.completed ? "Revisar" : "Iniciar"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Rocket className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Dica Rápida</h4>
              <p className="text-sm text-blue-700 mt-1">
                Complete o onboarding para desbloquear funcionalidades avançadas e aumentar sua produtividade em até 40%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
