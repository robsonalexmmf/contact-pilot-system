
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  Database,
  Activity,
  Bell,
  CreditCard,
  FileText,
  Globe
} from "lucide-react";

interface AdminSidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const AdminSidebar = ({ activeModule, setActiveModule, isOpen }: AdminSidebarProps) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const adminMenuItems = [
    { id: "admin-dashboard", label: "Dashboard Admin", icon: LayoutDashboard },
    { id: "admin-users", label: "Gerenciar Usuários", icon: Users },
    { id: "admin-system", label: "Sistema", icon: Database },
    { id: "admin-monitoring", label: "Monitoramento", icon: Activity },
    { id: "admin-billing", label: "Faturamento", icon: CreditCard },
    { id: "admin-reports", label: "Relatórios Admin", icon: BarChart3 },
    { id: "admin-notifications", label: "Notificações", icon: Bell },
    { id: "admin-security", label: "Segurança", icon: Shield },
    { id: "admin-logs", label: "Logs do Sistema", icon: FileText },
    { id: "admin-integrations", label: "Integrações", icon: Globe },
    { id: "admin-settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">Painel Administrativo</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive 
                      ? "bg-red-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4 rounded-lg border border-red-700">
            <h3 className="text-sm font-medium text-white mb-1">
              Modo Administrador
            </h3>
            <p className="text-xs text-gray-300 mb-2">
              Acesso total ao sistema
            </p>
            <div className="w-full text-xs bg-gradient-to-r from-red-600 to-orange-600 text-white py-1.5 px-2 rounded-md text-center">
              Admin Level Access
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
