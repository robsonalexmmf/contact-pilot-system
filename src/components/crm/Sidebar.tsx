
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
import { useLanguage } from "@/hooks/useLanguage";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeModule, setActiveModule, isOpen }: SidebarProps) => {
  const { t } = useLanguage();

  const menuItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "leads", label: t("leads"), icon: Users },
    { id: "pipeline", label: t("pipeline"), icon: Target },
    { id: "tasks", label: t("tasks"), icon: CheckSquare },
    { id: "proposals", label: t("proposals"), icon: FileText },
    { id: "calendar", label: t("calendar"), icon: Calendar },
    { id: "financial", label: t("financial"), icon: DollarSign },
    { id: "automation", label: t("automation"), icon: Zap },
    { id: "chat", label: t("chat"), icon: MessageCircle },
    { id: "reports", label: t("reports"), icon: BarChart3 },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Salesin Pro</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('systemComplete')}</p>
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
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-lg border dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              {t('premiumPlan')}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              {t('unlimitedResources')}
            </p>
            <button className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1.5 rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors">
              {t('managePlan')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
