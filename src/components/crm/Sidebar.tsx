
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  MessageCircle,
  FileText,
  Calendar,
  DollarSign,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads & Contatos", icon: Users },
  { id: "pipeline", label: "Pipeline de Vendas", icon: Target },
  { id: "tasks", label: "Tarefas", icon: CheckSquare },
  { id: "proposals", label: "Propostas", icon: FileText },
  { id: "calendar", label: "Agenda", icon: Calendar },
  { id: "financial", label: "Financeiro", icon: DollarSign },
  { id: "automation", label: "Automação", icon: Zap },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
];

export const Sidebar = ({ activeModule, setActiveModule, isOpen }: SidebarProps) => {
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">CRM Pro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistema Completo</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    isActive 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Plano Premium
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Recursos ilimitados
            </p>
            <button className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1.5 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors">
              Gerenciar Plano
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
