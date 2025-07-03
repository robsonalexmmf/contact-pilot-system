
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Plus, 
  Search,
  Edit,
  Trash2,
  DollarSign,
  BarChart3,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Sistema CRM Premium",
    description: "Sistema completo de gestão de relacionamento",
    price: 199.90,
    cost: 50.00,
    category: "Software",
    inventory: 0,
    status: "Ativo",
    sales: 45
  },
  {
    id: 2,
    name: "Consultoria em TI",
    description: "Serviço de consultoria especializada",
    price: 150.00,
    cost: 0,
    category: "Serviço",
    inventory: 0,
    status: "Ativo",
    sales: 23
  },
  {
    id: 3,
    name: "Licença Software Básica",
    description: "Versão básica do sistema",
    price: 99.90,
    cost: 25.00,
    category: "Software",
    inventory: 100,
    status: "Ativo",
    sales: 87
  }
];

export const ProductManager = () => {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sales), 0);
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.inventory > 0 && p.inventory < 10).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Produtos</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendas Totais</p>
                <p className="text-2xl font-bold text-purple-600">{products.reduce((sum, p) => sum + p.sales, 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">{lowStock}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Preço:</span>
                  <span className="font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                </div>
                {product.cost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Custo:</span>
                    <span className="text-sm">R$ {product.cost.toFixed(2)}</span>
                  </div>
                )}
                {product.inventory > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estoque:</span>
                    <span className={`text-sm ${product.inventory < 10 ? 'text-red-600 font-bold' : ''}`}>
                      {product.inventory} unidades
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vendas:</span>
                  <span className="text-sm font-medium">{product.sales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {product.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margem:</span>
                  <span className="font-bold text-blue-600">
                    {product.cost > 0 ? `${(((product.price - product.cost) / product.price) * 100).toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Comece cadastrando seu primeiro produto"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      )}
    </div>
  );
};
