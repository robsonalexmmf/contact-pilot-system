import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Users,
  Search,
  Download,
  Eye,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  FileText
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from "@/hooks/useFinancialData";
import { TransactionDetailsDialog } from "./TransactionDetailsDialog";

export const AdminBilling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { toast } = useToast();

  const { metrics, transactions, revenueData, loading, refreshData } = useFinancialData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    
    toast({
      title: "Dados Atualizados",
      description: "Informações financeiras atualizadas com sucesso!",
    });
    
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Nome', 'Email', 'Plano', 'Valor', 'Status', 'Data', 'Método', 'Descrição'];
      const csvRows = [
        headers.join(','),
        ...filteredTransactions.map(t => [
          `"${t.user_name}"`,
          `"${t.user_email}"`,
          `"${t.plan}"`,
          t.amount.toFixed(2),
          `"${getStatusText(t.status)}"`,
          `"${t.date}"`,
          `"${t.method}"`,
          `"${t.description}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `faturamento_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Exportação Concluída",
        description: `Relatório com ${filteredTransactions.length} transações exportado com sucesso!`,
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

  const handleGenerateReport = () => {
    try {
      // Calculate totals for the report
      const totalReceitas = filteredTransactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalTransactions = filteredTransactions.length;
      const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;
      const failedTransactions = filteredTransactions.filter(t => t.status === 'failed').length;

      // Group by plan with proper typing
      const planStats = filteredTransactions.reduce((acc: Record<string, { count: number; revenue: number }>, t) => {
        if (!acc[t.plan]) acc[t.plan] = { count: 0, revenue: 0 };
        acc[t.plan].count++;
        if (t.status === 'paid') acc[t.plan].revenue += t.amount;
        return acc;
      }, {});

      // Create HTML report
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório de Faturamento - ${new Date().toLocaleDateString('pt-BR')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .summary { background: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
            .summary h2 { color: #495057; margin-top: 0; }
            .metric { display: inline-block; margin: 10px 20px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #28a745; }
            .metric-label { font-size: 14px; color: #6c757d; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .status-paid { color: #28a745; font-weight: bold; }
            .status-pending { color: #ffc107; font-weight: bold; }
            .status-failed { color: #dc3545; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Faturamento</h1>
            <p>Período: ${new Date().toLocaleDateString('pt-BR')} | Total de Transações: ${totalTransactions}</p>
          </div>
          
          <div class="summary">
            <h2>Resumo Executivo</h2>
            <div class="metric">
              <div class="metric-value">R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div class="metric-label">Receita Total</div>
            </div>
            <div class="metric">
              <div class="metric-value">${totalTransactions}</div>
              <div class="metric-label">Total Transações</div>
            </div>
            <div class="metric">
              <div class="metric-value">${pendingTransactions}</div>
              <div class="metric-label">Pendentes</div>
            </div>
            <div class="metric">
              <div class="metric-value">${failedTransactions}</div>
              <div class="metric-label">Falharam</div>
            </div>
          </div>

          <h2>Estatísticas por Plano</h2>
          <table>
            <thead>
              <tr>
                <th>Plano</th>
                <th>Quantidade</th>
                <th>Receita</th>
                <th>Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(planStats).map(([plan, stats]) => `
                <tr>
                  <td>${plan}</td>
                  <td>${stats.count}</td>
                  <td>R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>R$ ${(stats.revenue / stats.count).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Transações Detalhadas</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Método</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>${t.user_name}</td>
                  <td>${t.user_email}</td>
                  <td>${t.plan}</td>
                  <td>R$ ${t.amount.toFixed(2)}</td>
                  <td class="status-${t.status}">${getStatusText(t.status)}</td>
                  <td>${t.method}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </body>
        </html>
      `;

      // Download the report
      const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-faturamento-${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório Gerado",
        description: "Relatório detalhado de faturamento foi baixado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro no Relatório",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleViewTransaction = (transaction) => {
    console.log('Visualizando transação:', transaction);
    setSelectedTransaction(transaction);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const planDistribution = [
    { name: 'Basic', value: transactions.filter(t => t.plan === 'Basic').length, color: '#3B82F6', monthly: 890 },
    { name: 'Premium', value: transactions.filter(t => t.plan === 'Premium').length, color: '#8B5CF6', monthly: 2300 },
    { name: 'Enterprise', value: transactions.filter(t => t.plan === 'Enterprise').length, color: '#10B981', monthly: 1600 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-600">Controle financeiro e receitas do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={handleGenerateReport}>
            <FileText className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">R$ {metrics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.revenue}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Recorrente</p>
                <p className="text-2xl font-bold text-blue-600">R$ {metrics.recurringRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.recurring}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.activeSubscriptions}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.subscriptions}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{metrics.growth.conversion}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Evolução da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'receita' ? `R$ ${Number(value).toLocaleString('pt-BR')}` : value,
                    name === 'receita' ? 'Receita' : name === 'usuarios' ? 'Usuários Pagos' : 'Assinaturas'
                  ]}
                />
                <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="assinaturas" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {planDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.value} usuários</div>
                    <div className="text-xs text-gray-500">R$ {item.monthly}/mês</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Transações Recentes ({filteredTransactions.length})
            </div>
          </CardTitle>
          <div className="flex space-x-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {transaction.user_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.user_name}</h4>
                      <p className="text-sm text-gray-600">{transaction.user_email}</p>
                      <p className="text-xs text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Plano</p>
                      <Badge variant="outline">{transaction.plan}</Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Valor</p>
                      <p className="font-medium">R$ {transaction.amount.toFixed(2)}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Método</p>
                      <p className="text-sm">{transaction.method}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="text-sm">{transaction.date}</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetailsDialog
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};
