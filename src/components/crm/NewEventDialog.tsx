
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NewEventDialogProps {
  onCreateEvent: (event: any) => void;
  trigger?: React.ReactNode;
}

export const NewEventDialog = ({ onCreateEvent, trigger }: NewEventDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    type: "Reunião",
    time: "",
    duration: "60",
    location: "Escritório",
    attendees: "",
    notes: ""
  });
  const { toast } = useToast();

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

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      date: date.toISOString().split('T')[0],
      time: formData.time,
      duration: `${formData.duration}min`,
      location: formData.location,
      attendees: formData.attendees.split(',').map(name => name.trim()).filter(name => name),
      notes: formData.notes,
      status: "Confirmado",
      createdAt: new Date().toISOString()
    };

    console.log("Criando novo evento:", newEvent);
    onCreateEvent(newEvent);

    toast({
      title: "Sucesso",
      description: `Evento "${formData.title}" criado com sucesso`,
    });

    // Reset form
    setFormData({
      title: "",
      type: "Reunião",
      time: "",
      duration: "60",
      location: "Escritório",
      attendees: "",
      notes: ""
    });
    setDate(undefined);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
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
                  disabled={(date) => date < new Date()}
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
