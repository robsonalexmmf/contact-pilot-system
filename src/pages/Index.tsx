import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/crm/Sidebar";
import { Header } from "@/components/crm/Header";
import { Dashboard } from "@/components/crm/Dashboard";
import { LeadsManager } from "@/components/crm/LeadsManager";
import { SalesPipeline } from "@/components/crm/SalesPipeline";
import { TasksManager } from "@/components/crm/TasksManager";
import { ProposalsManager } from "@/components/crm/ProposalsManager";
import { CalendarManager } from "@/components/crm/CalendarManager";
import { FinancialManager } from "@/components/crm/FinancialManager";
import { AutomationManager } from "@/components/crm/AutomationManager";
import { Reports } from "@/components/crm/Reports";
import { Settings } from "@/components/crm/Settings";
import { ChatInterface } from "@/components/crm/ChatInterface";
import { HelpDesk } from "@/components/crm/HelpDesk";
import { CustomerSuccess } from "@/components/crm/CustomerSuccess";
import { ProductManager } from "@/components/crm/ProductManager";
import { UserManagement } from "@/components/crm/UserManagement";
import { Integrations } from "@/components/crm/Integrations";
import { AICopilot } from "@/components/crm/AICopilot";
import { SocialCRM } from "@/components/crm/SocialCRM";
import { LeadScoring } from "@/components/crm/LeadScoring";
import { ExtensionsManager } from "@/components/crm/ExtensionsManager";
import { TeamMetrics } from "@/components/crm/TeamMetrics";
import { Academy } from "@/components/crm/Academy";
import { SandboxEnvironment } from "@/components/crm/SandboxEnvironment";
import { SentimentAnalysis } from "@/components/crm/SentimentAnalysis";
import { ERPLite } from "@/components/crm/ERPLite";
import { ABTesting } from "@/components/crm/ABTesting";
import { OnboardingFlow } from "@/components/crm/OnboardingFlow";
import { FormBuilder } from "@/components/crm/FormBuilder";
import { CommandPalette } from "@/components/crm/CommandPalette";
import { ComplianceManager } from "@/components/crm/ComplianceManager";
import { PlanLimitDialog } from "@/components/crm/PlanLimitDialog";
import { isPlanActive, getUsageInfo, isFeatureAvailable } from "@/utils/planService";
import { AdminDashboard } from "@/components/crm/AdminDashboard";
import { isAdminUser } from "@/utils/testUsers";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [planLimitDialog, setPlanLimitDialog] = useState<{
    open: boolean;
    limitType: string;
    currentCount: number;
  }>({ open: false, limitType: '', currentCount: 0 });
  
  const navigate = useNavigate();

  // Verificar se usuário está logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Verificar status do plano
  useEffect(() => {
    const { isActive, daysRemaining } = getUsageInfo();
    
    if (!isActive) {
      setPlanLimitDialog({
        open: true,
        limitType: 'days',
        currentCount: 0
      });
    }
  }, []);

  // Command Palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Verificar acesso a funcionalidades
  const checkFeatureAccess = (feature: string) => {
    if (!isPlanActive()) {
      setPlanLimitDialog({
        open: true,
        limitType: 'days',
        currentCount: 0
      });
      return false;
    }

    // Verificar funcionalidades específicas por plano
    const restrictedFeatures = {
      'automation': 'hasAdvancedReports',
      'integrations': 'hasApiAccess',
      'ai-copilot': 'hasApiAccess',
      'reports': 'hasAdvancedReports'
    };

    const requiredFeature = restrictedFeatures[feature as keyof typeof restrictedFeatures];
    if (requiredFeature && !isFeatureAvailable(requiredFeature as any)) {
      setPlanLimitDialog({
        open: true,
        limitType: feature,
        currentCount: 1
      });
      return false;
    }

    return true;
  };

  const renderActiveModule = () => {
    // Se for admin e estiver no dashboard, mostrar dashboard admin
    if (activeModule === "dashboard" && isAdminUser()) {
      return <AdminDashboard />;
    }

    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "leads":
        return <LeadsManager />;
      case "pipeline":
        return <SalesPipeline />;
      case "tasks":
        return <TasksManager />;
      case "proposals":
        return <ProposalsManager />;
      case "calendar":
        return <CalendarManager />;
      case "financial":
        return <FinancialManager />;
      case "automation":
        return checkFeatureAccess('automation') ? <AutomationManager /> : <Dashboard />;
      case "reports":
        return checkFeatureAccess('reports') ? <Reports /> : <Dashboard />;
      case "settings":
        return <Settings />;
      case "chat":
        return <ChatInterface />;
      case "helpdesk":
        return <HelpDesk />;
      case "customer-success":
        return <CustomerSuccess />;
      case "products":
        return <ProductManager />;
      case "users":
        return <UserManagement />;
      case "integrations":
        return checkFeatureAccess('integrations') ? <Integrations /> : <Dashboard />;
      case "ai-copilot":
        return checkFeatureAccess('ai-copilot') ? <AICopilot /> : <Dashboard />;
      case "social-crm":
        return <SocialCRM />;
      case "lead-scoring":
        return <LeadScoring />;
      case "extensions":
        return <ExtensionsManager />;
      case "team-metrics":
        return <TeamMetrics />;
      case "academy":
        return <Academy />;
      case "sandbox":
        return <SandboxEnvironment />;
      case "sentiment":
        return <SentimentAnalysis />;
      case "erp":
        return <ERPLite />;
      case "ab-testing":
        return <ABTesting />;
      case "onboarding":
        return <OnboardingFlow />;
      case "form-builder":
        return <FormBuilder />;
      case "compliance":
        return <ComplianceManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          activeModule={activeModule}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(module) => setActiveModule(module)}
      />

      <PlanLimitDialog
        open={planLimitDialog.open}
        onClose={() => setPlanLimitDialog({ open: false, limitType: '', currentCount: 0 })}
        limitType={planLimitDialog.limitType}
        currentCount={planLimitDialog.currentCount}
      />
    </div>
  );
};

export default Index;
