
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  ArrowDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const revenueData = [
  { month: 'Jan', receita: 32000, usuarios: 45, assinaturas: 23 },
  { month: 'Fev', receita: 38000, usuarios: 52, assinaturas: 28 },
  { month: 'Mar', receita: 42000, usuarios: 61, assinaturas: 34 },
  { month: 'Abr', receita: 45000, usuarios: 68, assinaturas: 38 },
  { month: 'Mai', receita: 51000, usuarios: 78, assinaturas: 45 },
  { month: 'Jun', receita: 58000, usuarios: 89, assinaturas: 52 }
];

const planDistribution = [
  { name: 'Pro', value: 45, color: '#3B82F6', monthly: 890 },
  { name: 'Premium', value: 23, color: '#8B5CF6', monthly: 2300 },
  { name: 'Enterprise', value: 8, color: '#10B981', monthly: 1600 }
];

const transactions = [
  {
    id: 1,
    user: "João Silva",
    email: "joao@empresa.com",
    plan: "Premium",
    amount: 149.90,
    status: "paid",
    date: "2024-01-15",
    method: "Cartão"
  },
  {
    id: 2,
    user: "Maria Santos",
    email: "maria@startup.com",
    plan: "Pro",
    amount: 79.90,
    status: "paid",
    date: "2024-01-15",
    method: "PIX"
  },
  {
    id: 3,
    user: "Pedro Costa",
    email: "pedro@negocio.com",
    plan: "Pro",
    amount: 79.90,
    status: "pending",
    date: "2024-01-14",
    method: "Boleto"
  },
  {
    id: 4,
    user: "Ana Oliveira",
    email: "ana@consultoria.com",
    plan: "Premium",
    amount: 149.90,
    status: "failed",
    date: "2024-01-14",
    method: "Cartão"
  },
  {
    id: 5,
    user: "Carlos Lima",
    email: "carlos@digital.com",
    plan: "Enterprise",
    amount: 299.90,
    status: "paid",
    date: "2024-01-13",
    method: "Transferência"
  }
];

export const AdminBilling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.email.toLowerCase().includes(searchTerm.toLowerCase());
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

  const totalRevenue = revenueData[revenueData.length - 1]?.receita || 0;
  const monthlyGrowth = revenueData.length > 1 ? 
    ((revenueData[revenueData.length - 1].receita - revenueData[revenueData.length - 2].receita) / revenueData[revenueData.length - 2].receita * 100).toFixed(1) : 0;
  const totalSubscriptions = planDistribution.reduce((sum, plan) => sum + plan.value, 0);
  const monthlyRecurring = planDistribution.reduce((sum, plan) => sum + plan.monthly, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-600">Controle financeiro e receitas do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
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
                <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{monthlyGrowth}% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Recorrente</p>
                <p className="text-2xl font-bold text-blue-600">R$ {monthlyRecurring.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+18% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-purple-600">{totalSubscriptions}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-orange-600">12.4%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+2.1% vs mês anterior</span>
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
                    name === 'receita' ? `R$ ${value.toLocaleString()}` : value,
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
              Transações Recentes
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
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {transaction.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.user}</h4>
                    <p className="text-sm text-gray-600">{transaction.email}</p>
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
                  
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
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
