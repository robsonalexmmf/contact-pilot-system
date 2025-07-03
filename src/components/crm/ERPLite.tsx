
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Calculator,
  Truck
} from "lucide-react";

const mockProducts = [
  { id: 1, name: "Plano Básico", price: 99, stock: 0, type: "Serviço" },
  { id: 2, name: "Plano Premium", price: 199, stock: 0, type: "Serviço" },
  { id: 3, name: "Consultoria", price: 500, stock: 5, type: "Produto" }
];

const mockTransactions = [
  { id: 1, type: "Receber", description: "Venda Plano Premium", value: 199, status: "Pago", due: "2024-01-15" },
  { id: 2, type: "Pagar", description: "Fornecedor Software", value: -89, status: "Pendente", due: "2024-01-20" },
  { id: 3, type: "Receber", description: "Consultoria Empresa ABC", value: 500, status: "Atrasado", due: "2024-01-10" }
];

export const ERPLite = () => {
  const [products] = useState(mockProducts);
  const [transactions] = useState(mockTransactions);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ERP Lite</h1>
          <p className="text-gray-600">Gestão financeira e produtos integrada ao CRM</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
          <FileText className="w-4 h-4 mr-2" />
          Emitir NFe
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">R$ 15.890</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">R$ 4.230</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">A Receber</p>
                <p className="text-2xl font-bold text-blue-600">R$ 8.920</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Produtos e Serviços
              </CardTitle>
              <Button size="sm" variant="outline">
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {product.price}</p>
                    {product.stock > 0 && (
                      <p className="text-xs text-gray-500">Estoque: {product.stock}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Contas a Pagar/Receber
              </CardTitle>
              <Button size="sm" variant="outline">
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <p className="text-sm text-gray-600">Vencimento: {transaction.due}</p>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${transaction.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {Math.abs(transaction.value)}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        {transaction.type === "Receber" ? "Cobrar" : "Pagar"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ERP Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Nota Fiscal</h3>
            <p className="text-sm text-gray-600">Emissão automática via API externa</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calculator className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Relatórios Fiscais</h3>
            <p className="text-sm text-gray-600">DRE, Balanço e controle tributário</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Estoque Básico</h3>
            <p className="text-sm text-gray-600">Controle simples de produtos físicos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
