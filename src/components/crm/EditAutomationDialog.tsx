
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Mail, MessageCircle, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditAutomationDialogProps {
  automation: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAutomation: (automation: any) => void;
}

const triggerTypes = [
  { id: "new_lead", name: "Novo Lead", icon: Users },
  { id: "email_opened", name: "Email Aberto", icon: Mail },
  { id: "form_submitted", name: "Formulário Enviado", icon: Users },
  { id: "time_based", name: "Baseado em Tempo", icon: Clock }
];

const actionTypes = [
  { id: "send_email", name: "Enviar Email", icon: Mail },
  { id: "send_whatsapp", name: "Enviar WhatsApp", icon: MessageCircle },
  { id: "schedule_meeting", name: "Agendar Reunião", icon: Calendar },
  { id: "assign_user", name: "Atribuir Usuário", icon: Users }
];

export const EditAutomationDialog = ({ automation, isOpen, onClose, onUpdateAutomation }: EditAutomationDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    message: "",
    delay: "",
    targetGroup: "all"
  });
  const { toast } = useToast();

  useEffect(() => {
    if (automation) {
      setFormData({
        name: automation.name || "",
        description: automation.description || "",
        trigger: automation.triggerType || "",
        action: automation.actionType || "",
        message: automation.message || "",
        delay: automation.delay || "",
        targetGroup: automation.targetGroup || "all"
      });
    }
  }, [automation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.trigger || !formData.action) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const updatedAutomation = {
      ...automation,
      name: formData.name,
      description: formData.description,
      trigger: getTriggerName(formData.trigger),
      action: getActionName(formData.action),
      triggerType: formData.trigger,
      actionType: formData.action,
      message: formData.message,
      delay: formData.delay,
      targetGroup: formData.targetGroup,
      updatedAt: new Date().toISOString()
    };

    console.log("Atualizando automação:", updatedAutomation);
    onUpdateAutomation(updatedAutomation);

    toast({
      title: "Sucesso",
      description: `Automação "${formData.name}" atualizada com sucesso`,
    });

    onClose();
  };

  const getTriggerName = (triggerId: string) => {
    return triggerTypes.find(t => t.id === triggerId)?.name || triggerId;
  };

  const getActionName = (actionId: string) => {
    return actionTypes.find(a => a.id === actionId)?.name || actionId;
  };

  if (!automation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Automação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Automação *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Welcome Email para Novos Leads"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o que esta automação faz..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="trigger">Gatilho *</Label>
            <Select value={formData.trigger} onValueChange={(value) => handleInputChange("trigger", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o gatilho" />
              </SelectTrigger>
              <SelectContent>
                {triggerTypes.map((trigger) => (
                  <SelectItem key={trigger.id} value={trigger.id}>
                    {trigger.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="action">Ação *</Label>
            <Select value={formData.action} onValueChange={(value) => handleInputChange("action", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a ação" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.action === 'send_email' || formData.action === 'send_whatsapp') && (
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Digite a mensagem que será enviada..."
                rows={3}
              />
            </div>
          )}

          {formData.trigger === 'time_based' && (
            <div>
              <Label htmlFor="delay">Atraso (minutos)</Label>
              <Input
                id="delay"
                type="number"
                value={formData.delay}
                onChange={(e) => handleInputChange("delay", e.target.value)}
                placeholder="Ex: 60 (1 hora)"
              />
            </div>
          )}

          <div>
            <Label htmlFor="targetGroup">Grupo Alvo</Label>
            <Select value={formData.targetGroup} onValueChange={(value) => handleInputChange("targetGroup", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Contatos</SelectItem>
                <SelectItem value="leads">Apenas Leads</SelectItem>
                <SelectItem value="customers">Apenas Clientes</SelectItem>
                <SelectItem value="prospects">Apenas Prospects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
