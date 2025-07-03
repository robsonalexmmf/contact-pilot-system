
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserDropdown } from "./UserDropdown";
import { GlobalSearch } from "./GlobalSearch";
import { NewLeadDialog } from "./NewLeadDialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect, useState } from "react";

interface HeaderProps {
  activeModule: string;
  toggleSidebar: () => void;
}

export const Header = ({ activeModule, toggleSidebar }: HeaderProps) => {
  const { t } = useLanguage();
  const [, forceUpdate] = useState({});

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const moduleNames: Record<string, string> = {
    dashboard: t("dashboard"),
    leads: t("leadManagement"),
    pipeline: t("salesPipeline"),
    tasks: t("tasksActivities"),
    reports: t("reports"),
    settings: t("settings"),
    chat: t("chatSupport"),
    compliance: t("complianceGovernance"),
    proposals: t("proposals"),
    calendar: t("calendar"),
    financial: t("financial"),
    automation: t("automation")
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {moduleNames[activeModule] || t("salesinPro")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <GlobalSearch />

          <NewLeadDialog />

          <NotificationsDropdown />

          <UserDropdown userName="João Silva" userRole={t("administrator")} />
        </div>
      </div>
    </header>
  );
};
