
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, Send, Edit, Calendar, DollarSign, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Proposal {
  id: number;
  title: string;
  client: string;
  company: string;
  value: number;
  status: string;
  createdAt: string;
  validUntil: string;
  template: string;
  notes?: string;
}

interface ProposalViewerProps {
  proposal: Proposal;
  onStatusUpdate: (proposalId: number, newStatus: string) => void;
  onEdit: (proposalId: number) => void;
  trigger?: React.ReactNode;
}

const statusColors: Record<string, string> = {
  "Rascunho": "bg-gray-100 text-gray-800",
  "Enviada": "bg-blue-100 text-blue-800",
  "Visualizada": "bg-yellow-100 text-yellow-800",
  "Aceita": "bg-green-100 text-green-800",
  "Rejeitada": "bg-red-100 text-red-800"
};

export const ProposalViewer = ({ proposal, onStatusUpdate, onEdit, trigger }: ProposalViewerProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    // Criar conteúdo HTML da proposta
    const proposalHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Proposta - ${proposal.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .section { margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .value { font-size: 24px; color: #059669; font-weight: bold; }
            .status { padding: 8px 16px; border-radius: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${proposal.title}</h1>
            <p>Proposta Comercial</p>
          </div>
          
          <div class="section">
            <h2>Informações do Cliente</h2>
            <div class="info-grid">
              <div><strong>Cliente:</strong> ${proposal.client}</div>
              <div><strong>Empresa:</strong> ${proposal.company}</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Detalhes da Proposta</h2>
            <div class="info-grid">
              <div><strong>Valor:</strong> <span class="value">R$ ${proposal.value.toLocaleString()}</span></div>
              <div><strong>Template:</strong> ${proposal.template}</div>
              <div><strong>Válida até:</strong> ${new Date(proposal.validUntil).toLocaleDateString('pt-BR')}</div>
              <div><strong>Status:</strong> ${proposal.status}</div>
            </div>
          </div>
          
          ${proposal.notes ? `
            <div class="section">
              <h2>Observações</h2>
              <p>${proposal.notes}</p>
            </div>
          ` : ''}
          
          <div class="section">
            <p><strong>Data de criação:</strong> ${new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `;

    // Criar e baixar o arquivo
    const blob = new Blob([proposalHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proposta-${proposal.id}-${proposal.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Download Concluído",
      description: `Arquivo HTML da proposta "${proposal.title}" foi baixado com sucesso`,
    });
  };

  const handleSendProposal = () => {
    if (proposal.status !== "Aceita") {
      onStatusUpdate(proposal.id, "Enviada");
      toast({
        title: "Proposta Enviada",
        description: `A proposta "${proposal.title}" foi marcada como enviada`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {proposal.title}
            <Badge className={statusColors[proposal.status]}>
              {proposal.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Visualização completa da proposta comercial
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-600 w-20">Cliente:</span>
                <span className="font-medium">{proposal.client}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-gray-600 w-20">Empresa:</span>
                <span className="font-medium">{proposal.company}</span>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Financeiros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Detalhes Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {proposal.value.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Válida até: {new Date(proposal.validUntil).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Técnicos */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Template:</span>
                  <div className="font-medium">{proposal.template}</div>
                </div>
                <div>
                  <span className="text-gray-600">Criada em:</span>
                  <div className="font-medium">{new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {proposal.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{proposal.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  onEdit(proposal.id);
                  setOpen(false);
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSendProposal}
                disabled={proposal.status === "Aceita"}
              >
                <Send className="w-4 h-4 mr-1" />
                Enviar
              </Button>
            </div>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-1" />
              Baixar HTML
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
