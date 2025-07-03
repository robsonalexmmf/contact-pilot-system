
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Video, 
  Phone, 
  MapPin,
  Users,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const mockEvents = [
  {
    id: 1,
    title: "Reunião com Cliente XYZ",
    description: "Apresentação da proposta comercial",
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
    type: "reuniao",
    location: "Escritório - Sala 2",
    attendees: ["Maria Santos", "João Silva"],
    status: "confirmado",
    priority: "alta"
  },
  {
    id: 2,
    title: "Call de Acompanhamento - StartupTech",
    description: "Verificar progresso do projeto",
    date: "2024-01-15",
    time: "16:30",
    duration: 30,
    type: "call",
    location: "Online - Google Meet",
    attendees: ["Pedro Costa"],
    status: "pendente",
    priority: "media"
  },
  {
    id: 3,
    title: "Demo do Produto - ABC Corp",
    description: "Demonstração técnica da solução",
    date: "2024-01-16",
    time: "10:00",
    duration: 90,
    type: "demo",
    location: "Online - Zoom",
    attendees: ["Ana Costa", "Carlos Santos"],
    status: "confirmado",
    priority: "alta"
  },
  {
    id: 4,
    title: "Follow-up Proposta",
    description: "Acompanhar retorno da proposta enviada",
    date: "2024-01-17",
    time: "09:00",
    duration: 15,
    type: "followup",
    location: "Telefone",
    attendees: ["Maria Santos"],
    status: "agendado",
    priority: "media"
  }
];

const eventTypeColors: Record<string, string> = {
  "reuniao": "bg-blue-100 text-blue-800",
  "call": "bg-green-100 text-green-800",
  "demo": "bg-purple-100 text-purple-800",
  "followup": "bg-yellow-100 text-yellow-800",
  "tarefa": "bg-gray-100 text-gray-800"
};

const priorityColors: Record<string, string> = {
  "alta": "border-red-500",
  "media": "border-yellow-500", 
  "baixa": "border-green-500"
};

export const CalendarManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const todayEvents = events.filter(event => 
    event.date === new Date().toISOString().split('T')[0]
  );

  const selectedDateEvents = events.filter(event => 
    selectedDate && event.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Hoje</p>
                <div className="text-2xl font-bold text-blue-600">
                  {todayEvents.length}
                </div>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Esta Semana</p>
                <div className="text-2xl font-bold text-green-600">
                  {events.length}
                </div>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reuniões</p>
                <div className="text-2xl font-bold text-purple-600">
                  {events.filter(e => e.type === 'reuniao').length}
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Calls</p>
                <div className="text-2xl font-bold text-orange-600">
                  {events.filter(e => e.type === 'call').length}
                </div>
              </div>
              <Phone className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="reuniao">Reuniões</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="demo">Demos</SelectItem>
              <SelectItem value="followup">Follow-ups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button 
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-r-none"
            >
              <CalendarIcon className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              Lista
            </Button>
          </div>

          <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Novo Evento</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" placeholder="Título do evento" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="tarefa">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input id="location" placeholder="Local ou link da reunião" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="attendees">Participantes</Label>
                  <Input id="attendees" placeholder="Emails separados por vírgula" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" placeholder="Descrição do evento" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Agendar Evento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendário */}
        {viewMode === "calendar" && (
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Eventos */}
        <div className={viewMode === "calendar" ? "lg:col-span-7" : "col-span-12"}>
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === "calendar" 
                  ? `Eventos - ${selectedDate?.toLocaleDateString('pt-BR')}` 
                  : "Todos os Eventos"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(viewMode === "calendar" ? selectedDateEvents : filteredEvents).map((event) => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 hover:shadow-md transition-shadow cursor-pointer",
                      priorityColors[event.priority]
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h4>
                          <Badge className={eventTypeColors[event.type]}>
                            {event.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time} ({event.duration}min)
                          </div>
                          <div className="flex items-center">
                            {event.location.includes('Online') ? (
                              <Video className="w-4 h-4 mr-2" />
                            ) : event.location.includes('Telefone') ? (
                              <Phone className="w-4 h-4 mr-2" />
                            ) : (
                              <MapPin className="w-4 h-4 mr-2" />
                            )}
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.attendees.join(', ')}
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(viewMode === "calendar" ? selectedDateEvents : filteredEvents).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                    <p className="text-gray-500 mb-4">
                      {viewMode === "calendar" 
                        ? "Não há eventos para esta data"
                        : searchTerm || selectedType !== "all" 
                          ? "Tente ajustar os filtros de busca"
                          : "Comece agendando seu primeiro evento"
                      }
                    </p>
                    <Button onClick={() => setIsNewEventOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar Evento
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
