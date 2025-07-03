
import { Bell, Menu, Shield, LogOut, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/testUsers";
import { NotificationsDropdown } from "./NotificationsDropdown";

interface AdminHeaderProps {
  activeModule: string;
  toggleSidebar: () => void;
  setActiveModule?: (module: string) => void;
}

export const AdminHeader = ({ activeModule, toggleSidebar, setActiveModule }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getModuleTitle = (module: string) => {
    const titles: { [key: string]: string } = {
      'admin-dashboard': 'Dashboard Administrativo',
      'admin-users': 'Gerenciar Usuários',
      'admin-system': 'Sistema',
      'admin-monitoring': 'Monitoramento',
      'admin-billing': 'Faturamento',
      'admin-reports': 'Relatórios Admin',
      'admin-notifications': 'Notificações',
      'admin-security': 'Segurança',
      'admin-logs': 'Logs do Sistema',
      'admin-integrations': 'Integrações',
      'admin-settings': 'Configurações'
    };
    return titles[module] || 'Painel Admin';
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:bg-gray-800"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h1 className="text-xl font-semibold text-white">
              {getModuleTitle(activeModule)}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Status do sistema */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Sistema Online</span>
          </div>

          {/* Badge de Admin */}
          <Badge className="bg-red-600 text-white hover:bg-red-700">
            ADMINISTRADOR
          </Badge>

          {/* Notificações */}
          <NotificationsDropdown />

          {/* Menu do usuário admin */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-gray-800">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.name.charAt(0) || 'A'}
                </div>
                <span className="hidden md:block font-medium">
                  {currentUser?.name || 'Administrador'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
              <DropdownMenuLabel className="text-white">
                <div>
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-sm text-gray-400">{currentUser?.email}</p>
                  <Badge className="mt-1 bg-red-600 text-white text-xs">Admin</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                onClick={() => setActiveModule?.('admin-users')}
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                onClick={() => setActiveModule?.('admin-monitoring')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Monitor do Sistema
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-gray-700 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sair do Admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
