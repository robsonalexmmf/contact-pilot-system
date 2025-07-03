
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
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

interface ProposalEditorProps {
  proposal: Proposal;
  onUpdateProposal: (updatedProposal: Proposal) => void;
  trigger?: React.ReactNode;
}

export const ProposalEditor = ({ proposal, onUpdateProposal, trigger }: ProposalEditorProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: proposal.title,
    client: proposal.client,
    company: proposal.company,
    value: proposal.value.toString(),
    template: proposal.template,
    validUntil: proposal.validUntil,
    notes: proposal.notes || "",
    status: proposal.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormData({
        title: proposal.title,
        client: proposal.client,
        company: proposal.company,
        value: proposal.value.toString(),
        template: proposal.template,
        validUntil: proposal.validUntil,
        notes: proposal.notes || "",
        status: proposal.status
      });
    }
  }, [open, proposal]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.value) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedProposal: Proposal = {
        ...proposal,
        title: formData.title,
        client: formData.client,
        company: formData.company || formData.client,
        value: parseInt(formData.value) || 0,
        validUntil: formData.validUntil,
        template: formData.template,
        notes: formData.notes,
        status: formData.status
      };

      console.log("Atualizando proposta:", updatedProposal);
      onUpdateProposal(updatedProposal);

      toast({
        title: "Sucesso",
        description: `Proposta "${formData.title}" foi atualizada com sucesso`,
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar proposta",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Proposta</DialogTitle>
          <DialogDescription>
            Atualize as informações da proposta comercial
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Nome da proposta"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client">Cliente *</Label>
                <Input
                  id="edit-client"
                  value={formData.client}
                  onChange={(e) => handleInputChange("client", e.target.value)}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Empresa</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-value">Valor *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => handleInputChange("template", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ERP Standard">ERP Standard</SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                    <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                    <SelectItem value="Personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-validUntil">Válida até</Label>
                <Input
                  id="edit-validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange("validUntil", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Enviada">Enviada</SelectItem>
                    <SelectItem value="Visualizada">Visualizada</SelectItem>
                    <SelectItem value="Aceita">Aceita</SelectItem>
                    <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre a proposta"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
