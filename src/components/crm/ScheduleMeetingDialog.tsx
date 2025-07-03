
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface ScheduleMeetingDialogProps {
  lead: Lead;
  trigger: React.ReactNode;
  onSchedule: (meetingData: any) => void;
}

export const ScheduleMeetingDialog = ({ lead, trigger, onSchedule }: ScheduleMeetingDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [location, setLocation] = useState("Video call");
  const [notes, setNotes] = useState("");

  const handleSchedule = () => {
    if (!date || !time) {
      alert("Por favor, selecione data e horário");
      return;
    }

    const meetingData = {
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      date: date,
      time: time,
      duration: duration,
      location: location,
      notes: notes,
      status: "Agendada"
    };

    onSchedule(meetingData);
    console.log("Reunião agendada:", meetingData);
    
    // Criar evento no calendário do usuário
    const startDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(duration));

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Reunião com ${lead.name}&dates=${startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Reunião agendada via Salesin Pro%0A%0AContato: ${lead.name}%0AEmpresa: ${lead.company}%0AEmail: ${lead.email}%0ATelefone: ${lead.phone}%0A%0AObservações: ${notes}&location=${location}`;
    
    window.open(calendarUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Reunião</DialogTitle>
          <p className="text-sm text-gray-600">
            Agendando reunião com {lead.name} - {lead.company}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Data da Reunião</Label>
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

          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="15"
              max="480"
            />
          </div>

          <div>
            <Label htmlFor="location">Local/Tipo</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Video call, Escritório, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agenda da reunião, tópicos a discutir..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSchedule} className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Agendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
