
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FormInput, 
  Plus,
  Edit,
  Copy,
  Eye,
  Settings,
  Type,
  Mail,
  Phone,
  Calendar,
  FileText
} from "lucide-react";

const mockForms = [
  {
    id: 1,
    name: "Solicitação de Orçamento",
    fields: 8,
    submissions: 147,
    status: "Ativo",
    created: "2024-01-10"
  },
  {
    id: 2,
    name: "Agendamento de Visita",
    fields: 6,
    submissions: 89,
    status: "Ativo",
    created: "2024-01-08"
  },
  {
    id: 3,
    name: "Contato Técnico",
    fields: 12,
    submissions: 23,
    status: "Rascunho",
    created: "2024-01-15"
  }
];

const fieldTypes = [
  { type: "text", icon: Type, label: "Texto" },
  { type: "email", icon: Mail, label: "E-mail" },
  { type: "phone", icon: Phone, label: "Telefone" },
  { type: "date", icon: Calendar, label: "Data" },
  { type: "textarea", icon: FileText, label: "Texto Longo" }
];

export const FormBuilder = () => {
  const [forms] = useState(mockForms);
  const [isBuilding, setIsBuilding] = useState(false);
  const [formFields, setFormFields] = useState([
    { id: 1, type: "text", label: "Nome Completo", required: true },
    { id: 2, type: "email", label: "E-mail", required: true },
    { id: 3, type: "phone", label: "Telefone", required: false }
  ]);

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const addField = (type: string) => {
    const newField = {
      id: formFields.length + 1,
      type,
      label: `Novo ${fieldTypes.find(f => f.type === type)?.label}`,
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Formulários</h1>
          <p className="text-gray-600">Crie formulários personalizados para captura de leads</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => setIsBuilding(!isBuilding)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isBuilding ? "Voltar à Lista" : "Novo Formulário"}
        </Button>
      </div>

      {!isBuilding ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Formulários</p>
                    <p className="text-2xl font-bold text-blue-600">{forms.length}</p>
                  </div>
                  <FormInput className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Respostas Total</p>
                    <p className="text-2xl font-bold text-green-600">259</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
                    <p className="text-2xl font-bold text-purple-600">73%</p>
                  </div>
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Formulários Ativos</p>
                    <p className="text-2xl font-bold text-orange-600">{forms.filter(f => f.status === "Ativo").length}</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FormInput className="w-5 h-5 mr-2" />
                Meus Formulários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{form.name}</h3>
                        <Badge className={getStatusColor(form.status)}>
                          {form.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {form.fields} campos • {form.submissions} respostas • Criado em {form.created}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Form Builder Interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Field Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Campo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fieldTypes.map((field) => (
                  <Button
                    key={field.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addField(field.type)}
                  >
                    <field.icon className="w-4 h-4 mr-2" />
                    {field.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Pré-visualização do Formulário</CardTitle>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Nome do Formulário" />
                
                {formFields.map((field) => (
                  <div key={field.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    {field.type === "textarea" ? (
                      <textarea 
                        className="w-full p-2 border rounded-md"
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                        rows={3}
                      />
                    ) : (
                      <Input 
                        type={field.type}
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  Enviar Formulário
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
