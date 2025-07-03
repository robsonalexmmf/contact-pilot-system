import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserDropdown } from "./UserDropdown";
import { GlobalSearch } from "./GlobalSearch";

interface HeaderProps {
  activeModule: string;
  toggleSidebar: () => void;
}

const moduleNames: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Gestão de Leads",
  pipeline: "Pipeline de Vendas",
  tasks: "Tarefas & Atividades",
  reports: "Relatórios",
  settings: "Configurações",
  chat: "Chat & Atendimento",
  compliance: "Compliance & Governança",
  proposals: "Propostas",
  calendar: "Agenda",
  financial: "Financeiro",
  automation: "Automação"
};

export const Header = ({ activeModule, toggleSidebar }: HeaderProps) => {
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
              {moduleNames[activeModule] || "Salesin Pro"}
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

          {/* O botão agora é renderizado pelo próprio NewLeadDialog */}
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => console.log("Este botão será substituído pelo NewLeadDialog")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>

          <NotificationsDropdown />

          <UserDropdown userName="João Silva" userRole="Administrador" />
        </div>
      </div>
    </header>
  );
};
