
import { useState } from "react";
import { Sidebar } from "@/components/crm/Sidebar";
import { Header } from "@/components/crm/Header";
import { Dashboard } from "@/components/crm/Dashboard";
import { LeadsManager } from "@/components/crm/LeadsManager";
import { SalesPipeline } from "@/components/crm/SalesPipeline";
import { TasksManager } from "@/components/crm/TasksManager";
import { Reports } from "@/components/crm/Reports";
import { Settings } from "@/components/crm/Settings";
import { ChatInterface } from "@/components/crm/ChatInterface";

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
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      case "chat":
        return <ChatInterface />;
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
