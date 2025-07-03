
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatContact } from "@/hooks/useChatManager";

interface NewChatDialogProps {
  onCreateChat: (chatData: Partial<ChatContact>) => void;
}

export const NewChatDialog = ({ onCreateChat }: NewChatDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    contact: "",
    company: "",
    phone: "",
    email: "",
    channel: "Chat Site" as const
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact) {
      toast({
        title: "Erro",
        description: "Nome do contato é obrigatório",
        variant: "destructive"
      });
      return;
    }

    onCreateChat(formData);

    toast({
      title: "Sucesso",
      description: `Novo chat iniciado com ${formData.contact}`,
    });

    // Reset form
    setFormData({
      contact: "",
      company: "",
      phone: "",
      email: "",
      channel: "Chat Site"
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Novo Chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contact">Nome do Contato *</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Ex: Empresa ABC"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Ex: (11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Ex: joao@empresa.com"
            />
          </div>

          <div>
            <Label htmlFor="channel">Canal</Label>
            <Select value={formData.channel} onValueChange={(value: any) => handleInputChange("channel", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Chat Site">Chat Site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Iniciar Chat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
