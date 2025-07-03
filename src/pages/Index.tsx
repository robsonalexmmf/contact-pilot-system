import { useState } from "react";
import { AdminDashboard } from "@/components/crm/AdminDashboard";
import { AdminUserManagement } from "@/components/crm/AdminUserManagement";
import { AdminSystem } from "@/components/crm/AdminSystem";
import { AdminMonitoring } from "@/components/crm/AdminMonitoring";
import { AdminBilling } from "@/components/crm/AdminBilling";
import { AdminReports } from "@/components/crm/AdminReports";
import { AdminNotifications } from "@/components/crm/AdminNotifications";
import { AdminSecurity } from "@/components/crm/AdminSecurity";
import { AdminLogs } from "@/components/crm/AdminLogs";
import { AdminIntegrations } from "@/components/crm/AdminIntegrations";
import { AdminSettings } from "@/components/crm/AdminSettings";

export default function Index() {
  const [activeModule, setActiveModule] = useState("admin-dashboard");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin modules */}
      {activeModule === "admin-dashboard" && (
        <AdminDashboard setActiveModule={setActiveModule} />
      )}
      {activeModule === "admin-users" && <AdminUserManagement />}
      {activeModule === "admin-system" && (
        <AdminSystem setActiveModule={setActiveModule} />
      )}
      {activeModule === "admin-monitoring" && <AdminMonitoring />}
      {activeModule === "admin-billing" && <AdminBilling />}
      {activeModule === "admin-reports" && <AdminReports />}
      {activeModule === "admin-notifications" && <AdminNotifications />}
      {activeModule === "admin-security" && <AdminSecurity />}
      {activeModule === "admin-logs" && <AdminLogs />}
      {activeModule === "admin-integrations" && <AdminIntegrations />}
      {activeModule === "admin-settings" && <AdminSettings />}
    </div>
  );
}
