
import { useState } from "react";
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

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderActiveModule = () => {
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
        return <AutomationManager />;
      case "reports":
        return <Reports />;
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
        return <Integrations />;
      case "ai-copilot":
        return <AICopilot />;
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
    </div>
  );
};

export default Index;
