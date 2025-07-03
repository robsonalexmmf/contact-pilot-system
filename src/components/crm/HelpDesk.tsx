
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Ticket, 
  Clock, 
  User, 
  Plus, 
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Users
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const HelpDesk = () => {
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

  const mockTickets = [
    {
      id: 1,
      title: t("apiIntegrationProblem"),
      description: t("clientCantConnect"),
      status: t("open"),
      priority: t("high"),
      customer: "Empresa XYZ",
      assignee: "João Silva",
      created: "2024-01-15",
      sla: `2h ${t("remaining")}`
    },
    {
      id: 2,
      title: t("reportQuestion"),
      description: t("howToExportData"),
      status: t("inProgress"),
      priority: t("medium"),
      customer: "StartupTech",
      assignee: "Maria Santos",
      created: "2024-01-14",
      sla: `4h ${t("remaining")}`
    }
  ];

  const [tickets] = useState(mockTickets);

  const statusColors: Record<string, string> = {
    [t("open")]: "bg-red-100 text-red-800",
    [t("inProgress")]: "bg-yellow-100 text-yellow-800",
    [t("waiting")]: "bg-blue-100 text-blue-800",
    [t("resolved")]: "bg-green-100 text-green-800"
  };

  const priorityColors: Record<string, string> = {
    [t("high")]: "bg-red-100 text-red-800",
    [t("medium")]: "bg-yellow-100 text-yellow-800",
    [t("low")]: "bg-green-100 text-green-800"
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("total")}</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("open")}</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("inProgress")}</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("resolved")}</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder={t("searchTickets")} className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            {t("filters")}
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          {t("newTicket")}
        </Button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">#{ticket.id} - {ticket.title}</h3>
                    <div className="flex space-x-2">
                      <Badge className={statusColors[ticket.status]}>
                        {ticket.status}
                      </Badge>
                      <Badge className={priorityColors[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ticket.customer}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {ticket.assignee}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {ticket.created}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {t("sla")}: {ticket.sla}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
