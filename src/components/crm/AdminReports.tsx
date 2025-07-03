
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Download,
  PieChart,
  Activity,
  Target,
  RefreshCw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useAdminReportsData } from "@/hooks/useAdminReportsData";

export const AdminReports = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const { 
    metrics, 
    monthlyData, 
    topUsers, 
    planDistribution, 
    systemMetrics, 
    loading, 
    refreshData 
  } = useAdminReportsData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    
    toast({
      title: "Dados Atualizados",
      description: "Relatórios atualizados com sucesso!",
    });
    
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const exportReport = (type: string) => {
    try {
      console.log(`Exportando relatório: ${type}`);
      
      // Criar conteúdo do relatório
      const reportData = {
        metrics,
        monthlyData,
        topUsers,
        planDistribution,
        systemMetrics,
        generatedAt: new Date().toISOString()
      };

      // Gerar CSV com dados dos relatórios
      const csvHeaders = ['Métrica', 'Valor', 'Crescimento'];
      const csvRows = [
        csvHeaders.join(','),
        `"Total de Usuários","${metrics.totalUsers}","+${metrics.growth.users}%"`,
        `"Receita Total","R$ ${metrics.totalRevenue.toLocaleString('pt-BR')}","+${metrics.growth.revenue}%"`,
        `"Total de Leads","${metrics.totalLeads}","+${metrics.growth.leads}%"`,
        `"Receita por Usuário","R$ ${metrics.avgRevenuePerUser.toLocaleString('pt-BR')}","+${metrics.growth.avgRevenue}%"`,
        '',
        'Top Usuários,Empresa,Receita,Leads,Plano',
        ...topUsers.map(user => 
          `"${user.name}","${user.company}","R$ ${user.revenue.toLocaleString('pt-BR')}","${user.leads}","${user.plan}"`
        ),
        '',
        'Distribuição de Planos,Percentual',
        ...planDistribution.map(plan => `"${plan.name}","${plan.value}%"`)
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-admin-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório Exportado",
        description: `Relatório ${type} foi baixado com sucesso!`,
      });

    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na Exportação",
        description: "Não foi possível exportar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const generateDetailedReport = () => {
    try {
      // Gerar relatório HTML detalhado
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório Administrativo Detalhado - ${new Date().toLocaleDateString('pt-BR')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary { background: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
            .metric { display: inline-block; margin: 10px 20px; text-align: center; padding: 15px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-value { font-size: 24px; font-weight: bold; color: #28a745; }
            .metric-label { font-size: 14px; color: #6c757d; margin-top: 5px; }
            .growth { font-size: 12px; color: #28a745; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .positive { color: #28a745; font-weight: bold; }
            .chart-section { margin: 30px 0; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório Administrativo Detalhado</h1>
            <p>Período: ${dateRange} | Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
          
          <div class="summary">
            <h2>Resumo Executivo</h2>
            <div class="metric">
              <div class="metric-value">${metrics.totalUsers}</div>
              <div class="metric-label">Total de Usuários</div>
              <div class="growth">+${metrics.growth.users}% vs período anterior</div>
            </div>
            <div class="metric">
              <div class="metric-value">R$ ${metrics.totalRevenue.toLocaleString('pt-BR')}</div>
              <div class="metric-label">Receita Total</div>
              <div class="growth">+${metrics.growth.revenue}% vs período anterior</div>
            </div>
            <div class="metric">
              <div class="metric-value">${metrics.totalLeads}</div>
              <div class="metric-label">Total de Leads</div>
              <div class="growth">+${metrics.growth.leads}% vs período anterior</div>
            </div>
            <div class="metric">
              <div class="metric-value">R$ ${Math.round(metrics.avgRevenuePerUser).toLocaleString('pt-BR')}</div>
              <div class="metric-label">Receita por Usuário</div>
              <div class="growth">+${metrics.growth.avgRevenue}% vs período anterior</div>
            </div>
          </div>

          <div class="chart-section">
            <h2>Crescimento Mensal</h2>
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Usuários</th>
                  <th>Receita</th>
                  <th>Leads</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyData.map(data => `
                  <tr>
                    <td>${data.month}</td>
                    <td>${data.users}</td>
                    <td>R$ ${data.revenue.toLocaleString('pt-BR')}</td>
                    <td>${data.leads}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <h2>Top Usuários por Receita</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>Receita</th>
                <th>Leads</th>
                <th>Plano</th>
              </tr>
            </thead>
            <tbody>
              ${topUsers.map(user => `
                <tr>
                  <td>${user.name}</td>
                  <td>${user.company}</td>
                  <td class="positive">R$ ${user.revenue.toLocaleString('pt-BR')}</td>
                  <td>${user.leads}</td>
                  <td>${user.plan}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Distribuição de Planos</h2>
          <table>
            <thead>
              <tr>
                <th>Plano</th>
                <th>Percentual</th>
              </tr>
            </thead>
            <tbody>
              ${planDistribution.map(plan => `
                <tr>
                  <td>${plan.name}</td>
                  <td>${plan.value}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Métricas do Sistema</h2>
          <table>
            <thead>
              <tr>
                <th>Métrica</th>
                <th>Valor</th>
                <th>Tendência</th>
              </tr>
            </thead>
            <tbody>
              ${systemMetrics.map(metric => `
                <tr>
                  <td>${metric.metric}</td>
                  <td>${metric.value}</td>
                  <td>${metric.trend}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema CRM em ${new Date().toLocaleString('pt-BR')}</p>
            <p>Dados baseados em informações reais do banco de dados</p>
          </div>
        </body>
        </html>
      `;

      // Download do relatório
      const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-administrativo-detalhado-${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório Detalhado Gerado",
        description: "Relatório HTML completo foi baixado com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao gerar relatório detalhado:', error);
      toast({
        title: "Erro no Relatório",
        description: "Não foi possível gerar o relatório detalhado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando relatórios administrativos...</p>
        </div>
      </div>
    );
  }

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button variant="outline" onClick={() => exportReport('completo')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={generateDetailedReport}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatório Completo
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
                <p className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.users}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {metrics.totalRevenue.toLocaleString('pt-BR')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.revenue}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.totalLeads}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.leads}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita/Usuário</p>
                <p className="text-2xl font-bold text-orange-600">R$ {Math.round(metrics.avgRevenuePerUser).toLocaleString('pt-BR')}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.avgRevenue}% vs mês anterior</span>
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
              {topUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum usuário encontrado</p>
                </div>
              ) : (
                topUsers.map((user, index) => (
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
                      <p className="text-sm font-medium text-green-600">R$ {user.revenue.toLocaleString('pt-BR')}</p>
                      <p className="text-xs text-gray-500">{user.leads} leads • {user.plan}</p>
                    </div>
                  </div>
                ))
              )}
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
