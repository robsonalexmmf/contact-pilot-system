
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  Settings,
  Plus,
  BarChart3
} from "lucide-react";

const mockTeamMembers = [
  {
    id: 1,
    name: "João Silva",
    role: "Vendedor Senior",
    monthlyGoal: 50000,
    achieved: 42500,
    progress: 85,
    deals: 12,
    conversion: 23.5,
    ranking: 1
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Vendedor",
    monthlyGoal: 40000,
    achieved: 31200,
    progress: 78,
    deals: 9,
    conversion: 19.8,
    ranking: 2
  },
  {
    id: 3,
    name: "Pedro Costa",
    role: "Vendedor Junior",
    monthlyGoal: 25000,
    achieved: 18750,
    progress: 75,
    deals: 6,
    conversion: 15.2,
    ranking: 3
  }
];

const mockTeamGoals = [
  {
    id: 1,
    title: "Meta Mensal de Vendas",
    target: 115000,
    achieved: 92450,
    progress: 80.4,
    period: "Janeiro 2024"
  },
  {
    id: 2,
    title: "Novos Clientes",
    target: 15,
    achieved: 12,
    progress: 80,
    period: "Janeiro 2024"
  }
];

export const TeamMetrics = () => {
  const [teamMembers] = useState(mockTeamMembers);
  const [teamGoals] = useState(mockTeamGoals);

  const getRankingBadge = (ranking: number) => {
    switch (ranking) {
      case 1:
        return <Badge className="bg-yellow-100 text-yellow-800">🥇 1º Lugar</Badge>;
      case 2:
        return <Badge className="bg-gray-100 text-gray-800">🥈 2º Lugar</Badge>;
      case 3:
        return <Badge className="bg-orange-100 text-orange-800">🥉 3º Lugar</Badge>;
      default:
        return <Badge variant="outline">{ranking}º Lugar</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Equipe por Metas</h2>
          <p className="text-gray-600">Acompanhe o desempenho e metas da equipe</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Metas
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equipe Total</p>
                <p className="text-2xl font-bold text-blue-600">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meta do Mês</p>
                <p className="text-2xl font-bold text-green-600">R$ 115k</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alcançado</p>
                <p className="text-2xl font-bold text-purple-600">R$ 92k</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-orange-600">80%</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Metas da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.period}</p>
                  </div>
                  <Badge variant="outline">
                    {goal.progress.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {typeof goal.achieved === 'number' && goal.achieved > 1000 
                        ? `R$ ${(goal.achieved / 1000).toFixed(0)}k`
                        : goal.achieved.toString()
                      } / {typeof goal.target === 'number' && goal.target > 1000 
                        ? `R$ ${(goal.target / 1000).toFixed(0)}k`
                        : goal.target.toString()
                      }
                    </span>
                    <span>
                      Faltam {typeof goal.target === 'number' && goal.target > 1000 
                        ? `R$ ${((goal.target - goal.achieved) / 1000).toFixed(0)}k`
                        : (goal.target - goal.achieved).toString()
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ranking da Equipe</CardTitle>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Relatório Completo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers
              .sort((a, b) => b.progress - a.progress)
              .map((member, index) => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    {getRankingBadge(index + 1)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Meta Mensal</p>
                      <p className="font-semibold">R$ {(member.monthlyGoal / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Alcançado</p>
                      <p className="font-semibold text-green-600">R$ {(member.achieved / 1000).toFixed(1)}k</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Conversão</p>
                      <p className="font-semibold">{member.conversion}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da Meta</span>
                      <span className="font-medium">{member.progress}%</span>
                    </div>
                    <Progress value={member.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{member.deals} negócios fechados</span>
                      <span>Faltam R$ {((member.monthlyGoal - member.achieved) / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
