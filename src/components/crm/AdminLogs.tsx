
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Download,
  Filter,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  RefreshCw
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const systemLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:30:15",
    level: "INFO",
    source: "AUTH_SERVICE",
    user: "joao@empresa.com",
    action: "USER_LOGIN",
    message: "Usuário logado com sucesso",
    ip: "192.168.1.100",
    details: { sessionId: "sess_123456", userAgent: "Chrome/120.0" }
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:29:45",
    level: "ERROR",
    source: "DATABASE",
    user: "system",
    action: "CONNECTION_FAILED",
    message: "Falha na conexão com o banco de dados",
    ip: "localhost",
    details: { error: "Connection timeout", retries: 3 }
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:28:30",
    level: "WARN",
    source: "API_GATEWAY",
    user: "maria@startup.com",
    action: "RATE_LIMIT_EXCEEDED",
    message: "Limite de requisições excedido",
    ip: "10.0.0.1",
    details: { endpoint: "/api/leads", limit: 100 }
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:27:12",
    level: "INFO",
    source: "CRM_SERVICE",
    user: "pedro@negocio.com",
    action: "LEAD_CREATED",
    message: "Novo lead criado",
    ip: "192.168.1.102",
    details: { leadId: "lead_789", source: "website_form" }
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:26:00",
    level: "ERROR",
    source: "EMAIL_SERVICE",
    user: "system",
    action: "EMAIL_SEND_FAILED",
    message: "Falha no envio de email",
    ip: "localhost",
    details: { recipient: "cliente@email.com", error: "SMTP timeout" }
  }
];

const logSources = ["ALL", "AUTH_SERVICE", "DATABASE", "API_GATEWAY", "CRM_SERVICE", "EMAIL_SERVICE", "BACKUP_SERVICE"];
const logLevels = ["ALL", "INFO", "WARN", "ERROR", "DEBUG"];

export const AdminLogs = () => {
  const [logs] = useState(systemLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === "ALL" || log.source === sourceFilter;
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    
    return matchesSearch && matchesSource && matchesLevel;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <X className="w-4 h-4 text-red-500" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'INFO': return <Info className="w-4 h-4 text-blue-500" />;
      case 'DEBUG': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARN': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'DEBUG': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Level,Source,User,Action,Message,IP\n" +
      filteredLogs.map(log => 
        `${log.timestamp},${log.level},${log.source},${log.user},${log.action},"${log.message}",${log.ip}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const errorLogs = logs.filter(l => l.level === 'ERROR').length;
  const warningLogs = logs.filter(l => l.level === 'WARN').length;
  const infoLogs = logs.filter(l => l.level === 'INFO').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs do Sistema</h1>
          <p className="text-gray-600">Visualize e analise logs de atividade do sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportLogs} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Logs</p>
                <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erros</p>
                <p className="text-2xl font-bold text-red-600">{errorLogs}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avisos</p>
                <p className="text-2xl font-bold text-yellow-600">{warningLogs}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Informações</p>
                <p className="text-2xl font-bold text-blue-600">{infoLogs}</p>
              </div>
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar nos logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Fonte" />
          </SelectTrigger>
          <SelectContent>
            {logSources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            {logLevels.map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Logs do Sistema ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border border-gray-200 rounded-lg">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getLevelIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={getLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                        <Badge variant="outline">
                          {log.source}
                        </Badge>
                        <span className="text-sm text-gray-600">{log.action}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{log.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.timestamp}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <User className="w-3 h-3 mr-1" />
                      {log.user}
                    </div>
                  </div>
                </div>
                
                {expandedLog === log.id && (
                  <div className="px-3 pb-3 border-t border-gray-100 bg-gray-50">
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-medium w-20">IP:</span>
                        <span>{log.ip}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20">Detalhes:</span>
                        <pre className="text-xs bg-white p-2 rounded border">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
