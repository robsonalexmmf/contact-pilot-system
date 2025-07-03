
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock,
  Users,
  Video,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import { NewEventDialog } from "./NewEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialEvents = [
  {
    id: 1,
    title: "Reunião com Maria Santos",
    type: "Reunião",
    date: "2024-01-16",
    time: "09:00",
    duration: "60min",
    location: "Escritório",
    attendees: ["Maria Santos", "João Silva"],
    status: "Confirmado",
    notes: "Discussão sobre proposta comercial"
  },
  {
    id: 2,
    title: "Apresentação StartupTech",
    type: "Apresentação",
    date: "2024-01-16", 
    time: "14:00",
    duration: "120min",
    location: "Video call",
    attendees: ["João Silva", "Ana Costa"],
    status: "Pendente",
    notes: "Demo do produto para cliente"
  },
  {
    id: 3,
    title: "Follow-up ABC Corp",
    type: "Follow-up",
    date: "2024-01-17",
    time: "10:30",
    duration: "30min",
    location: "Telefone",
    attendees: ["Ana Costa"],
    status: "Confirmado",
    notes: "Acompanhamento pós-venda"
  }
];

const typeColors: Record<string, string> = {
  "Reunião": "bg-blue-100 text-blue-800",
  "Apresentação": "bg-purple-100 text-purple-800",
  "Follow-up": "bg-green-100 text-green-800",
  "Ligação": "bg-yellow-100 text-yellow-800",
  "Workshop": "bg-orange-100 text-orange-800",
  "Treinamento": "bg-indigo-100 text-indigo-800"
};

const statusColors: Record<string, string> = {
  "Confirmado": "bg-green-100 text-green-800",
  "Pendente": "bg-yellow-100 text-yellow-800",
  "Cancelado": "bg-red-100 text-red-800"
};

export const CalendarManager = () => {
  const [events, setEvents] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateEvent = (newEvent: any) => {
    setEvents(prev => [...prev, newEvent]);
    console.log("Evento criado:", newEvent);
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    if (updatedEvent.deleted) {
      setEvents(prev => prev.filter(event => event.id !== updatedEvent.id));
    } else {
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    }
    console.log("Evento atualizado:", updatedEvent);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowEditDialog(true);
  };

  const handleJoinMeeting = (event: any) => {
    if (event.location === "Video call") {
      // Simular abertura de link de videoconferência
      const meetingUrl = `https://meet.google.com/new`;
      window.open(meetingUrl, '_blank');
      toast({
        title: "Entrando na reunião",
        description: `Abrindo ${event.title}`,
      });
    } else {
      toast({
        title: "Informação",
        description: "Este evento não é uma videoconferência",
        variant: "destructive"
      });
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.attendees.some((attendee: string) => 
                           attendee.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const todayEvents = filteredEvents.filter(event => 
    new Date(event.date).toDateString() === new Date().toDateString()
  );

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date) > new Date()
  ).slice(0, 5);

  // Calcular estatísticas dinâmicas
  const thisWeekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate >= today && eventDate <= weekFromNow;
  });

  const meetingEvents = events.filter(e => e.type === "Reunião");
  const pendingEvents = events.filter(e => e.status === "Pendente");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600">Gerencie seus compromissos e reuniões</p>
        </div>
        <NewEventDialog onCreateEvent={handleCreateEvent} />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Reunião">Reunião</SelectItem>
                  <SelectItem value="Apresentação">Apresentação</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Ligação">Ligação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-blue-600">{todayEvents.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-green-600">{thisWeekEvents.length}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reuniões</p>
                <p className="text-2xl font-bold text-purple-600">{meetingEvents.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingEvents.length}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Calendário</CardTitle>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={handlePreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
                <Button size="sm" variant="outline" onClick={handleNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i + 1;
                const hasEvents = events.some(event => {
                  const eventDay = new Date(event.date).getDate();
                  return eventDay === day && day <= 31;
                });
                
                return (
                  <div key={i} className={`aspect-square p-2 border rounded hover:bg-gray-50 cursor-pointer ${hasEvents ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="text-sm">{day <= 31 ? day : ''}</div>
                    {hasEvents && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle>Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum evento hoje</p>
              ) : (
                todayEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex space-x-1">
                        <Badge className={typeColors[event.type]}>
                          {event.type}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time} - {event.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos ({filteredEvents.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento próximo encontrado</p>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <Badge className={typeColors[event.type]}>
                        {event.type}
                      </Badge>
                      <Badge className={statusColors[event.status]}>
                        {event.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time} - {event.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {Array.isArray(event.attendees) ? event.attendees.length : 0} participantes
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {event.location === "Video call" && (
                      <Button size="sm" onClick={() => handleJoinMeeting(event)} className="bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-1" />
                        Entrar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          isOpen={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setEditingEvent(null);
          }}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
};
