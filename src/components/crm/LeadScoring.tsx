
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Mail, 
  MousePointer, 
  Eye,
  Star,
  Settings,
  Plus,
  Activity
} from "lucide-react";

const mockLeadScores = [
  {
    id: 1,
    name: "Maria Santos",
    score: 85,
    activities: [
      { type: "email_open", points: 10, description: "Abriu email de boas-vindas" },
      { type: "page_visit", points: 15, description: "Visitou página de preços" },
      { type: "download", points: 20, description: "Baixou material" }
    ],
    trend: "up",
    lastActivity: "2 min atrás"
  },
  {
    id: 2,
    name: "João Silva",
    score: 72,
    activities: [
      { type: "email_click", points: 15, description: "Clicou em link do email" },
      { type: "form_fill", points: 25, description: "Preencheu formulário" }
    ],
    trend: "up",
    lastActivity: "1 hora atrás"
  }
];

const mockScoringRules = [
  { id: 1, trigger: "Abrir email", points: 10, active: true },
  { id: 2, trigger: "Visitar página de preços", points: 15, active: true },
  { id: 3, trigger: "Baixar material", points: 20, active: true },
  { id: 4, trigger: "Preencher formulário", points: 25, active: true },
  { id: 5, trigger: "Clicar em link", points: 15, active: false }
];

export const LeadScoring = () => {
  const [leadScores] = useState(mockLeadScores);
  const [scoringRules] = useState(mockScoringRules);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email_open":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "page_visit":
        return <Eye className="w-4 h-4 text-green-500" />;
      case "email_click":
        return <MousePointer className="w-4 h-4 text-purple-500" />;
      case "download":
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case "form_fill":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lead Scoring Comportamental</h2>
          <p className="text-gray-600">Pontuação automática baseada em comportamento</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Regras
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score Médio</p>
                <p className="text-2xl font-bold text-blue-600">78.5</p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Quentes</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                <p className="text-2xl font-bold text-purple-600">{scoringRules.filter(r => r.active).length}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atividades Hoje</p>
                <p className="text-2xl font-bold text-orange-600">127</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Leads por Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadScores.map((lead) => (
              <div key={lead.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-gray-500">Última atividade: {lead.lastActivity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <Progress value={lead.score} className="w-24 mt-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Atividades Recentes:</h4>
                  {lead.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {getActivityIcon(activity.type)}
                        <span>{activity.description}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring Rules */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Regras de Pontuação</CardTitle>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scoringRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="font-medium">{rule.trigger}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">+{rule.points} pontos</Badge>
                  <Button size="sm" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
