
import { useState } from "react";
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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewLeadDialogProps {
  onCreateLead?: (lead: any) => void;
}

export const NewLeadDialog = ({ onCreateLead }: NewLeadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    notes: "",
    value: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newLead = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        status: "Novo",
        score: Math.floor(Math.random() * 30) + 70,
        source: formData.source || "Manual",
        lastContact: new Date().toISOString().split('T')[0],
        value: parseInt(formData.value) || 0,
        notes: formData.notes
      };

      console.log("Criando novo lead:", newLead);
      
      if (onCreateLead) {
        onCreateLead(newLead);
      }

      toast({
        title: "Sucesso!",
        description: `Lead ${formData.name} foi criado com sucesso`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "",
        notes: "",
        value: ""
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar lead:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar lead. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo lead para adicioná-lo ao sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nome do lead"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Nome da empresa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valor Estimado (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre o lead..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
