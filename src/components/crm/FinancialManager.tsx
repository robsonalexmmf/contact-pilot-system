
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Plus,
  Filter,
  Search,
  Download,
  CreditCard,
  Banknote,
  PieChart
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const mockTransactions = [
  {
    id: 1,
    type: "receita",
    description: "Pagamento - Empresa XYZ",
    amount: 45000,
    date: "2024-01-15",
    status: "pago",
    category: "Vendas",
    client: "Empresa XYZ",
    method: "Pix"
  },
  {
    id: 2,
    type: "despesa",
    description: "Marketing Digital",
    amount: 3500,
    date: "2024-01-14",
    status: "pago",
    category: "Marketing",
    client: "",
    method: "Cartão"
  },
  {
    id: 3,
    type: "receita", 
    description: "Consultoria - StartupTech",
    amount: 15000,
    date: "2024-01-13",
    status: "pendente",
    category: "Consultoria",
    client: "StartupTech",
    method: "Boleto"
  },
  {
    id: 4,
    type: "despesa",
    description: "Hospedagem e Domínio",
    amount: 500,
    date: "2024-01-12",
    status: "pago",
    category: "Tecnologia",
    client: "",
    method: "Cartão"
  }
];

const statusColors: Record<string, string> = {
  "pago": "bg-green-100 text-green-800",
  "pendente": "bg-yellow-100 text-yellow-800",
  "vencido": "bg-red-100 text-red-800",
  "cancelado": "bg-gray-100 text-gray-800"
};

export const FinancialManager = () => {
  const [transactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalReceitas = transactions.filter(t => t.type === "receita").reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === "despesa").reduce((sum, t) => sum + t.amount, 0);
  const saldoTotal = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Receitas</p>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString()}
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Despesas</p>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString()}
                </div>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Saldo Total</p>
                <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {saldoTotal.toLocaleString()}
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Transações</p>
                <div className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <PieChart className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>

          <Dialog open={isNewTransactionOpen} onOpenChange={setIsNewTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Transação</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor *</Label>
                  <Input id="amount" type="number" placeholder="0,00" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input id="description" placeholder="Descrição da transação" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="operacional">Operacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Forma de Pagamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Input id="client" placeholder="Nome do cliente" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" placeholder="Informações adicionais" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTransactionOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Adicionar Transação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'receita' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'receita' ? 
                      <TrendingUp className="w-5 h-5 text-green-600" /> : 
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      {transaction.client && <span>• {transaction.client}</span>}
                      <span>• {new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[transaction.status]}>
                        {transaction.status}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        {transaction.method === 'Pix' && <Banknote className="w-3 h-3 mr-1" />}
                        {(transaction.method === 'Cartão' || transaction.method === 'Boleto') && <CreditCard className="w-3 h-3 mr-1" />}
                        {transaction.method}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedType !== "all" 
                    ? "Tente ajustar os filtros de busca"
                    : "Comece adicionando sua primeira transação"
                  }
                </p>
                <Button onClick={() => setIsNewTransactionOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Transação
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
