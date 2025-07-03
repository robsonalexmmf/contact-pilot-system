import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  Activity,
  Target
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const monthlyData = [
  { month: 'Jan', users: 120, revenue: 45000, leads: 350 },
  { month: 'Fev', users: 145, revenue: 52000, leads: 420 },
  { month: 'Mar', users: 162, revenue: 58000, leads: 480 },
  { month: 'Abr', users: 178, revenue: 65000, leads: 520 },
  { month: 'Mai', users: 195, revenue: 72000, leads: 580 },
  { month: 'Jun', users: 210, revenue: 78000, leads: 620 }
];

const planDistribution = [
  { name: 'Free', value: 45, color: '#94A3B8' },
  { name: 'Pro', value: 30, color: '#3B82F6' },
  { name: 'Premium', value: 25, color: '#8B5CF6' }
];

const topUsers = [
  { name: 'João Silva', company: 'Tech Corp', revenue: 15000, leads: 85, plan: 'Premium' },
  { name: 'Maria Santos', company: 'StartupX', revenue: 12000, leads: 70, plan: 'Premium' },
  { name: 'Pedro Costa', company: 'Consultoria ABC', revenue: 8500, leads: 55, plan: 'Pro' },
  { name: 'Ana Oliveira', company: 'Vendas Plus', revenue: 7200, leads: 48, plan: 'Pro' },
  { name: 'Carlos Lima', company: 'Negócios 360', revenue: 6800, leads: 42, plan: 'Pro' }
];

const systemMetrics = [
  { metric: 'Uptime', value: '99.9%', trend: '+0.1%', color: 'text-green-600' },
  { metric: 'Tempo de Resposta', value: '145ms', trend: '-12ms', color: 'text-green-600' },
  { metric: 'Taxa de Erro', value: '0.01%', trend: '-0.02%', color: 'text-green-600' },
  { metric: 'Armazenamento', value: '78%', trend: '+5%', color: 'text-yellow-600' }
];

export const AdminReports = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  const totalUsers = monthlyData[monthlyData.length - 1]?.users || 0;
  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const totalLeads = monthlyData.reduce((sum, data) => sum + data.leads, 0);
  const avgRevenuePerUser = Math.round(totalRevenue / totalUsers);

  const exportReport = (type: string) => {
    console.log(`Exportando relatório: ${type}`);
    // Simulação de export
    alert(`Relatório ${type} exportado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Admin</h1>
          <p className="text-gray-600">Análises detalhadas e métricas do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportReport('completo')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+18% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+24% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-purple-600">{totalLeads.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita/Usuário</p>
                <p className="text-2xl font-bold text-orange-600">R$ {avgRevenuePerUser}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+5% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Crescimento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Usuários" />
                <Line type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={2} name="Leads" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Distribuição de Planos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {planDistribution.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Top Usuários por Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">R$ {user.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{user.leads} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Métricas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                    <p className="text-xs text-gray-600">vs período anterior</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                    <p className={`text-xs ${metric.color}`}>{metric.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
