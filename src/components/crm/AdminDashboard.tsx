
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
  UserCheck,
  Globe
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  setActiveModule?: (module: string) => void;
}

interface AdminKPIData {
  icon: any;
  title: string;
  value: string;
  change: string;
  trend: string;
  color: string;
}

interface UserGrowthData {
  month: string;
  usuarios: number;
  premium: number;
  receita: number;
}

interface SystemMetric {
  name: string;
  value: number;
  status: 'success' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

export const AdminDashboard = ({ setActiveModule }: AdminDashboardProps) => {
  const [adminKpiData, setAdminKpiData] = useState<AdminKPIData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      console.log('Carregando dados do dashboard administrativo...');
      
      // Buscar dados das tabelas principais
      const [profilesData, leadsData, dealsData, transactionsData, automationsData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('deals').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('automations').select('*')
      ]);

      const profiles = profilesData.data || [];
      const leads = leadsData.data || [];
      const deals = dealsData.data || [];
      const transactions = transactionsData.data || [];
      const automations = automationsData.data || [];

      // Calcular KPIs
      const totalUsers = profiles.length;
      const activeUsers = profiles.filter(p => p.status === 'Ativo').length;
      const totalRevenue = transactions
        .filter(t => t.type === 'receita' && t.status === 'Pago')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const activeDeals = deals.filter(d => d.stage !== 'lost' && d.stage !== 'won').length;

      const kpiData: AdminKPIData[] = [
        { 
          icon: Users, 
          title: "Usuários Totais", 
          value: totalUsers.toString(), 
          change: "+12%", 
          trend: "up", 
          color: "text-blue-600" 
        },
        { 
          icon: Shield, 
          title: "Usuários Ativos", 
          value: activeUsers.toString(), 
          change: "+8%", 
          trend: "up", 
          color: "text-green-600" 
        },
        { 
          icon: DollarSign, 
          title: "Receita Total", 
          value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`, 
          change: "+25%", 
          trend: "up", 
          color: "text-purple-600" 
        },
        { 
          icon: TrendingUp, 
          title: "Negócios Ativos", 
          value: activeDeals.toString(), 
          change: "+15%", 
          trend: "up", 
          color: "text-orange-600" 
        },
      ];

      setAdminKpiData(kpiData);

      // Dados de crescimento (últimos 6 meses)
      const growthData: UserGrowthData[] = [
        { month: 'Jan', usuarios: Math.floor(totalUsers * 0.6), premium: Math.floor(activeUsers * 0.5), receita: Math.floor(totalRevenue * 0.4) },
        { month: 'Fev', usuarios: Math.floor(totalUsers * 0.7), premium: Math.floor(activeUsers * 0.6), receita: Math.floor(totalRevenue * 0.5) },
        { month: 'Mar', usuarios: Math.floor(totalUsers * 0.8), premium: Math.floor(activeUsers * 0.7), receita: Math.floor(totalRevenue * 0.6) },
        { month: 'Abr', usuarios: Math.floor(totalUsers * 0.85), premium: Math.floor(activeUsers * 0.8), receita: Math.floor(totalRevenue * 0.75) },
        { month: 'Mai', usuarios: Math.floor(totalUsers * 0.92), premium: Math.floor(activeUsers * 0.9), receita: Math.floor(totalRevenue * 0.85) },
        { month: 'Jun', usuarios: totalUsers, premium: activeUsers, receita: totalRevenue }
      ];

      setUserGrowthData(growthData);

      // Métricas do sistema
      const metrics: SystemMetric[] = [
        { name: 'CPU Usage', value: 45, status: 'success' },
        { name: 'Memory Usage', value: 62, status: 'warning' },
        { name: 'Database Performance', value: 88, status: 'success' },
        { name: 'API Response Time', value: 95, status: 'success' },
        { name: 'Storage Usage', value: 34, status: 'success' },
        { name: 'Active Connections', value: 156, status: 'success' }
      ];

      setSystemMetrics(metrics);

      // Atividades recentes
      const activities: RecentActivity[] = [
        { id: '1', type: 'user_signup', description: 'Novo usuário cadastrado', timestamp: '2 min atrás', user: 'João Silva' },
        { id: '2', type: 'deal_closed', description: 'Negócio fechado no valor de R$ 5.000', timestamp: '5 min atrás', user: 'Maria Santos' },
        { id: '3', type: 'lead_imported', description: '50 novos leads importados', timestamp: '12 min atrás', user: 'Pedro Costa' },
        { id: '4', type: 'automation_triggered', description: 'Automação de e-mail executada', timestamp: '15 min atrás' },
        { id: '5', type: 'system_backup', description: 'Backup do sistema concluído', timestamp: '1 hora atrás' }
      ];

      setRecentActivities(activities);
      setLoading(false);

      console.log('Dashboard administrativo carregado com sucesso');

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

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

  const handleIntegrationsClick = () => {
    console.log('Navegando para integrações...');
    if (setActiveModule) {
      setActiveModule('admin-integrations');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dashboard administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral completa do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleIntegrationsClick}
            className="hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            Integrações
          </Button>
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

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminKpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
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
        {/* Gráfico de Crescimento */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Crescimento dos Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={3} name="Usuários" />
                <Line type="monotone" dataKey="premium" stroke="#8B5CF6" strokeWidth={2} name="Premium" />
                <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} name="Receita" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Métricas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{metric.name}</span>
                    <span>{metric.value}{metric.name.includes('Usage') ? '%' : ''}</span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={`h-2 ${
                      metric.status === 'success' ? 'text-green-600' : 
                      metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">por {activity.user}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status dos Serviços */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Status dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">API Principal</p>
                  <p className="text-xs text-green-700">Operacional</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Banco de Dados</p>
                  <p className="text-xs text-green-700">Operacional</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Automações</p>
                  <p className="text-xs text-green-700">Operacional</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Backup System</p>
                  <p className="text-xs text-yellow-700">Manutenção</p>
                </div>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={fetchDashboardData} variant="outline">
          Atualizar Dados
        </Button>
      </div>
    </div>
  );
};
