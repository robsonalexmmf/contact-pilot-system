
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search,
  Shield,
  Settings,
  UserCheck,
  UserX,
  Mail,
  Phone
} from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Admin",
    status: "Ativo",
    lastLogin: "2024-01-15 14:30",
    permissions: ["read", "write", "delete", "admin"]
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Gerente",
    status: "Ativo",
    lastLogin: "2024-01-15 13:45",
    permissions: ["read", "write"]
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@empresa.com",
    role: "Vendedor",
    status: "Inativo",
    lastLogin: "2024-01-10 09:15",
    permissions: ["read"]
  }
];

const roleColors: Record<string, string> = {
  "Admin": "bg-red-100 text-red-800",
  "Gerente": "bg-blue-100 text-blue-800",
  "Vendedor": "bg-green-100 text-green-800",
  "Estagiário": "bg-yellow-100 text-yellow-800"
};

export const UserManagement = () => {
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => u.status === "Ativo").length;
  const inactiveUsers = users.filter(u => u.status === "Inativo").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Inativos</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">1</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Shield className="w-4 h-4 mr-2" />
            Permissões
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Função</p>
                      <Badge className={roleColors[user.role]}>
                        {user.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={user.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {user.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Último Login</p>
                      <p className="text-sm font-medium">{user.lastLogin}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Permissões:</p>
                    <div className="flex space-x-2">
                      {user.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Shield className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum usuário encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente outros termos de busca" : "Comece adicionando usuários ao sistema"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      )}
    </div>
  );
};
