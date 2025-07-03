
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const kpiData = [
  { icon: Users, title: "Total de Leads", value: "2,847", change: "+12%", trend: "up", color: "text-blue-600" },
  { icon: Target, title: "Oportunidades Ativas", value: "157", change: "+8%", trend: "up", color: "text-green-600" },
  { icon: DollarSign, title: "Receita do Mês", value: "R$ 127.500", change: "+23%", trend: "up", color: "text-purple-600" },
  { icon: TrendingUp, title: "Taxa de Conversão", value: "18.5%", change: "-2%", trend: "down", color: "text-orange-600" },
];

const salesData = [
  { month: 'Jan', vendas: 65000, leads: 120 },
  { month: 'Fev', vendas: 78000, leads: 142 },
  { month: 'Mar', vendas: 92000, leads: 165 },
  { month: 'Abr', vendas: 87000, leads: 148 },
  { month: 'Mai', vendas: 105000, leads: 198 },
  { month: 'Jun', vendas: 127500, leads: 234 }
];

const pipelineData = [
  { name: 'Qualificação', value: 45, color: '#3B82F6' },
  { name: 'Proposta', value: 28, color: '#10B981' },
  { name: 'Negociação', value: 18, color: '#F59E0B' },
  { name: 'Fechamento', value: 9, color: '#EF4444' }
];

const recentActivities = [
  { id: 1, type: "lead", message: "Novo lead: Maria Santos da Empresa XYZ", time: "2 min atrás" },
  { id: 2, type: "deal", message: "Proposta enviada para João Silva - R$ 15.000", time: "15 min atrás" },
  { id: 3, type: "task", message: "Tarefa concluída: Follow-up com cliente ABC", time: "1h atrás" },
  { id: 4, type: "meeting", message: "Reunião agendada com Pedro Costa para amanhã", time: "2h atrás" },
  { id: 5, type: "deal", message: "Negócio fechado: R$ 25.000 - Empresa Beta", time: "3h atrás" }
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {kpi.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${kpi.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'vendas' ? `R$ ${value.toLocaleString()}` : value,
                    name === 'vendas' ? 'Vendas' : 'Leads'
                  ]}
                />
                <Line type="monotone" dataKey="vendas" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="leads" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pipelineData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Atividades Recentes
              </div>
              <Badge variant="secondary">5 novas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Metas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Receita</span>
                <span className="text-sm font-bold">R$ 127.500 / R$ 150.000</span>
              </div>
              <Progress value={85} className="h-2" />
              <span className="text-xs text-gray-500 mt-1">85% da meta</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Novos Leads</span>
                <span className="text-sm font-bold">234 / 300</span>
              </div>
              <Progress value={78} className="h-2" />
              <span className="text-xs text-gray-500 mt-1">78% da meta</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Negócios Fechados</span>
                <span className="text-sm font-bold">12 / 20</span>
              </div>
              <Progress value={60} className="h-2" />
              <span className="text-xs text-gray-500 mt-1">60% da meta</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
