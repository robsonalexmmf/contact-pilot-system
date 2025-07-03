
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2,
  Eye,
  Lock
} from "lucide-react";

const complianceRules = [
  {
    id: 1,
    name: "LGPD - Lei Geral de Proteção de Dados",
    status: "Ativo",
    description: "Conformidade com a legislação brasileira de proteção de dados",
    lastUpdate: "2024-01-15"
  },
  {
    id: 2,
    name: "GDPR - General Data Protection Regulation",
    status: "Ativo",
    description: "Conformidade com regulamentação europeia",
    lastUpdate: "2024-01-10"
  },
  {
    id: 3,
    name: "CCPA - California Consumer Privacy Act",
    status: "Inativo",
    description: "Conformidade com legislação da Califórnia",
    lastUpdate: "2024-01-05"
  }
];

const dataRetentionPolicies = [
  {
    type: "Leads",
    period: "24 meses",
    action: "Arquivar automaticamente",
    enabled: true
  },
  {
    type: "Conversas",
    period: "12 meses",
    action: "Excluir permanentemente",
    enabled: true
  },
  {
    type: "Relatórios",
    period: "36 meses",
    action: "Mover para arquivo morto",
    enabled: false
  }
];

export const ComplianceManager = () => {
  const [rules] = useState(complianceRules);
  const [policies, setPolicies] = useState(dataRetentionPolicies);

  const togglePolicy = (index: number) => {
    setPolicies(prev => prev.map((policy, i) => 
      i === index ? { ...policy, enabled: !policy.enabled } : policy
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Governança</h1>
          <p className="text-gray-600">Conformidade com regulamentações de proteção de dados</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
          <Shield className="w-4 h-4 mr-2" />
          Auditoria Completa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regras Ativas</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dados Protegidos</p>
                <p className="text-2xl font-bold text-blue-600">15.4k</p>
              </div>
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Políticas Ativas</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Regras de Conformidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                  <Badge className={rule.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {rule.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Última atualização: {rule.lastUpdate}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Políticas de Retenção de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{policy.type}</h3>
                      <Badge variant="outline">{policy.period}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{policy.action}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {policy.enabled ? "Ativa" : "Inativa"}
                    </span>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => togglePolicy(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Auditoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Exportar Dados</h4>
              <p className="text-sm text-gray-600 mb-3">Gerar relatório completo de conformidade</p>
              <Button size="sm" variant="outline">Exportar</Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Exclusão de Dados</h4>
              <p className="text-sm text-gray-600 mb-3">Remover dados conforme solicitação</p>
              <Button size="sm" variant="outline">Configurar</Button>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Eye className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-medium mb-2">Log de Acessos</h4>
              <p className="text-sm text-gray-600 mb-3">Rastrear acessos a dados sensíveis</p>
              <Button size="sm" variant="outline">Ver Logs</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
