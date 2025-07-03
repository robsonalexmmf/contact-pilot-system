import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  Server,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  UserCheck
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const adminKpiData = [
  { icon: Users, title: "Usuários Ativos", value: "1,247", change: "+15%", trend: "up", color: "text-blue-600" },
  { icon: Shield, title: "Contas Premium", value: "89", change: "+23%", trend: "up", color: "text-purple-600" },
  { icon: DollarSign, title: "Receita Mensal", value: "R$ 45.780", change: "+18%", trend: "up", color: "text-green-600" },
  { icon: Server, title: "Uptime do Sistema", value: "99.8%", change: "+0.2%", trend: "up", color: "text-orange-600" },
];

const userGrowthData = [
  { month: 'Jan', usuarios: 850, premium: 45, receita: 22500 },
  { month: 'Fev', usuarios: 920, premium: 52, receita: 26000 },
  { month: 'Mar', usuarios: 1050, premium: 61, receita: 30500 },
  { month: 'Abr', usuarios: 1150, premium: 68, receita: 34000 },
  { month: 'Mai', usuarios: 1200, premium: 78, receita: 39000 },
  { month: 'Jun', usuarios: 1247, premium: 89, receita: 45780 }
];

const planDistributionData = [
  { name: 'Free', value: 758, color: '#94A3B8', percentage: 60.8 },
  { name: 'Pro', value: 400, color: '#3B82F6', percentage: 32.1 },
  { name: 'Premium', value: 89, color: '#8B5CF6', percentage: 7.1 }
];

const systemAlerts = [
  { id: 1, type: "warning", message: "Limite de armazenamento em 85%", priority: "medium", time: "5 min atrás" },
  { id: 2, type: "info", message: "Backup automático concluído", priority: "low", time: "1h atrás" },
  { id: 3, type: "error", message: "Falha na integração com WhatsApp", priority: "high", time: "2h atrás" },
  { id: 4, type: "success", message: "Atualização de segurança aplicada", priority: "medium", time: "3h atrás" }
];

const recentUsers = [
  { id: 1, name: "João Silva", email: "joao@empresa.com", plan: "premium", status: "active", joined: "2 dias atrás" },
  { id: 2, name: "Maria Santos", email: "maria@startup.com", plan: "pro", status: "active", joined: "5 dias atrás" },
  { id: 3, name: "Pedro Costa", email: "pedro@negocio.com", plan: "free", status: "pending", joined: "1 sem atrás" },
  { id: 4, name: "Ana Oliveira", email: "ana@consultoria.com", plan: "premium", status: "active", joined: "2 sem atrás" }
];

interface AdminDashboardProps {
  setActiveModule?: (module: string) => void;
}

export const AdminDashboard = ({ setActiveModule }: AdminDashboardProps) => {
  const handleSettingsClick = () => {
    console.log('Navegando para configurações...');
    if (setActiveModule) {
      setActiveModule('admin-settings');
    }
  };

  const handleUserManagementClick = () => {
    console.log('Navegando para gerenciar usuários...');
    if (setActiveModule) {
      setActiveModule('admin-users');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema e métricas administrativas</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSettingsClick}
            className="hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button 
            size="sm"
            onClick={handleUserManagementClick}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Gerenciar Usuários
          </Button>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
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
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Crescimento de Usuários e Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'receita' ? `R$ ${value.toLocaleString()}` : value,
                    name === 'usuarios' ? 'Usuários' : name === 'premium' ? 'Premium' : 'Receita'
                  ]}
                />
                <Line type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="premium" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {planDistributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.value}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alertas do Sistema
              </div>
              <Badge variant="secondary">4 alertas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' : 
                    alert.type === 'warning' ? 'bg-yellow-500' : 
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                      <Badge className={`text-xs ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Usuários Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPlanColor(user.plan)}>
                      {user.plan.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Status dos Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">API Principal</p>
                <p className="text-xs text-green-700">Funcionando</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Banco de Dados</p>
                <p className="text-xs text-green-700">Funcionando</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">WhatsApp API</p>
                <p className="text-xs text-yellow-700">Instável</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Email Service</p>
                <p className="text-xs text-green-700">Funcionando</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
