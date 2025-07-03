
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EditEventDialogProps {
  event: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvent: (event: any) => void;
}

export const EditEventDialog = ({ event, isOpen, onClose, onUpdateEvent }: EditEventDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    type: "Reunião",
    time: "",
    duration: "60",
    location: "Escritório",
    attendees: "",
    notes: "",
    status: "Confirmado"
  });
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        type: event.type || "Reunião",
        time: event.time || "",
        duration: event.duration?.replace('min', '') || "60",
        location: event.location || "Escritório",
        attendees: Array.isArray(event.attendees) ? event.attendees.join(', ') : "",
        notes: event.notes || "",
        status: event.status || "Confirmado"
      });
      if (event.date) {
        setDate(new Date(event.date));
      }
    }
  }, [event]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !date || !formData.time) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const updatedEvent = {
      ...event,
      title: formData.title,
      type: formData.type,
      date: date.toISOString().split('T')[0],
      time: formData.time,
      duration: `${formData.duration}min`,
      location: formData.location,
      attendees: formData.attendees.split(',').map(name => name.trim()).filter(name => name),
      notes: formData.notes,
      status: formData.status,
      updatedAt: new Date().toISOString()
    };

    console.log("Atualizando evento:", updatedEvent);
    onUpdateEvent(updatedEvent);

    toast({
      title: "Sucesso",
      description: `Evento "${formData.title}" atualizado com sucesso`,
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este evento?")) {
      onUpdateEvent({ ...event, deleted: true });
      toast({
        title: "Evento excluído",
        description: `Evento "${event.title}" foi excluído`,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Nome do evento"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reunião">Reunião</SelectItem>
                  <SelectItem value="Apresentação">Apresentação</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Ligação">Ligação</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Treinamento">Treinamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duração (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                min="15"
                max="480"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Ex: Escritório, Video call, etc."
            />
          </div>

          <div>
            <Label htmlFor="attendees">Participantes</Label>
            <Input
              id="attendees"
              value={formData.attendees}
              onChange={(e) => handleInputChange("attendees", e.target.value)}
              placeholder="Separar nomes por vírgula"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Agenda, tópicos a discutir..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="destructive" onClick={handleDelete} className="flex-1">
              Excluir
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
