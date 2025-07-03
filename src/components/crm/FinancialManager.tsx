
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NewTransactionDialog } from "./NewTransactionDialog";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { FinancialReportDialog } from "./FinancialReportDialog";

const initialTransactions = [
  {
    id: 1,
    type: "Receita",
    description: "Pagamento - Empresa XYZ",
    amount: 45000,
    date: "2024-01-15",
    status: "Confirmado",
    category: "Vendas",
    client: "Maria Santos"
  },
  {
    id: 2,
    type: "Despesa",
    description: "Licença Software",
    amount: -2500,
    date: "2024-01-14",
    status: "Pago",
    category: "Operacional",
    client: ""
  },
  {
    id: 3,
    type: "Receita",
    description: "Consultoria - StartupTech",
    amount: 15000,
    date: "2024-01-13",
    status: "Pendente",
    category: "Serviços",
    client: "João Silva"
  }
];

const monthlyData = [
  { month: 'Jan', receita: 125000, despesa: 45000, lucro: 80000 },
  { month: 'Fev', receita: 142000, despesa: 52000, lucro: 90000 },
  { month: 'Mar', receita: 165000, despesa: 48000, lucro: 117000 },
  { month: 'Abr', receita: 148000, despesa: 55000, lucro: 93000 },
  { month: 'Mai', receita: 198000, despesa: 62000, lucro: 136000 },
  { month: 'Jun', receita: 234000, despesa: 58000, lucro: 176000 }
];

const statusColors: Record<string, string> = {
  "Confirmado": "bg-green-100 text-green-800",
  "Pendente": "bg-yellow-100 text-yellow-800",
  "Pago": "bg-blue-100 text-blue-800",
  "Atrasado": "bg-red-100 text-red-800"
};

export const FinancialManager = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const handleCreateTransaction = (newTransaction: any) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    if (updatedTransaction.deleted) {
      setTransactions(prev => prev.filter(t => t.id !== updatedTransaction.id));
    } else {
      setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
    }
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  // Calculate dynamic totals
  const totalReceita = transactions
    .filter(t => t.type === "Receita" && (t.status === "Confirmado" || t.status === "Pago"))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesa = Math.abs(transactions
    .filter(t => t.type === "Despesa")
    .reduce((sum, t) => sum + t.amount, 0));

  const lucroLiquido = totalReceita - totalDespesa;
  const transacoesPendentes = transactions.filter(t => t.status === "Pendente").length;

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle suas receitas e despesas</p>
        </div>
        <div className="flex space-x-2">
          <FinancialReportDialog transactions={transactions} />
          <NewTransactionDialog onCreateTransaction={handleCreateTransaction} />
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalReceita.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalDespesa.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-5%</span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                <p className="text-2xl font-bold text-blue-600">R$ {lucroLiquido.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">+23%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{transacoesPendentes}</p>
                <div className="flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">A receber</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa - Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `R$ ${Number(value).toLocaleString()}`,
                  name === 'receita' ? 'Receita' : name === 'despesa' ? 'Despesa' : 'Lucro'
                ]}
              />
              <Line type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="despesa" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="lucro" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma transação encontrada</p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${transaction.type === 'Receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'Receita' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        {transaction.client && (
                          <>
                            <span>•</span>
                            <span>{transaction.client}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <Badge className={statusColors[transaction.status]}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleEditTransaction(transaction)}>
                      Editar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <EditTransactionDialog
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
        />
      )}
    </div>
  );
};
