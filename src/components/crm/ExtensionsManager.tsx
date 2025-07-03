
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Puzzle, 
  Search,
  Download,
  Settings,
  Star,
  Shield,
  Zap,
  Plus,
  Code,
  Globe,
  Smartphone
} from "lucide-react";

const mockExtensions = [
  {
    id: 1,
    name: "WhatsApp Business Pro",
    description: "Integração avançada com WhatsApp Business API",
    category: "Comunicação",
    version: "2.1.0",
    installed: true,
    rating: 4.8,
    downloads: 15420,
    developer: "CRM Solutions"
  },
  {
    id: 2,
    name: "Advanced Analytics",
    description: "Relatórios e dashboards personalizados com IA",
    category: "Analytics",
    version: "1.5.2",
    installed: false,
    rating: 4.6,
    downloads: 8930,
    developer: "DataTech"
  },
  {
    id: 3,
    name: "E-commerce Connector",
    description: "Conecta com principais plataformas de e-commerce",
    category: "Integrações",
    version: "3.0.1",
    installed: true,
    rating: 4.9,
    downloads: 12750,
    developer: "IntegrationHub"
  }
];

const mockCategories = [
  { name: "Todos", count: 45, icon: <Globe className="w-4 h-4" /> },
  { name: "Comunicação", count: 12, icon: <Smartphone className="w-4 h-4" /> },
  { name: "Analytics", count: 8, icon: <Star className="w-4 h-4" /> },
  { name: "Integrações", count: 15, icon: <Zap className="w-4 h-4" /> },
  { name: "Automação", count: 10, icon: <Settings className="w-4 h-4" /> }
];

export const ExtensionsManager = () => {
  const [extensions] = useState(mockExtensions);
  const [categories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ext.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installedCount = extensions.filter(e => e.installed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Marketplace de Extensões</h2>
          <p className="text-gray-600">Adicione funcionalidades extras ao seu CRM</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Code className="w-4 h-4 mr-2" />
          Desenvolver Extensão
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instaladas</p>
                <p className="text-2xl font-bold text-green-600">{installedCount}</p>
              </div>
              <Puzzle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-blue-600">{extensions.length - installedCount}</p>
              </div>
              <Download className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length - 1}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Atualizações</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar extensões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
              className="whitespace-nowrap"
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExtensions.map((extension) => (
          <Card key={extension.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Puzzle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{extension.name}</h3>
                    <p className="text-sm text-gray-600">v{extension.version}</p>
                  </div>
                </div>
                {extension.installed && (
                  <Badge className="bg-green-100 text-green-800">
                    Instalado
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{extension.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <Badge variant="outline">{extension.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Desenvolvedor:</span>
                  <span className="font-medium">{extension.developer}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{extension.rating}</span>
                  </div>
                  <span className="text-gray-600">{extension.downloads.toLocaleString()} downloads</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                {extension.installed ? (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="ghost">
                      Desinstalar
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Download className="w-4 h-4 mr-2" />
                    Instalar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExtensions.length === 0 && (
        <div className="text-center py-12">
          <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma extensão encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Explore as extensões disponíveis"}
          </p>
        </div>
      )}
    </div>
  );
};
