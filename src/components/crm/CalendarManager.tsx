
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock,
  Users,
  Video,
  MapPin,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const mockEvents = [
  {
    id: 1,
    title: "Reunião com Maria Santos",
    type: "Reunião",
    date: "2024-01-16",
    time: "09:00",
    duration: "1h",
    location: "Escritório",
    attendees: ["Maria Santos", "João Silva"],
    status: "Confirmado"
  },
  {
    id: 2,
    title: "Apresentação StartupTech",
    type: "Apresentação",
    date: "2024-01-16", 
    time: "14:00",
    duration: "2h",
    location: "Video call",
    attendees: ["João Silva", "Ana Costa"],
    status: "Pendente"
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
    status: "Confirmado"
  }
];

const typeColors: Record<string, string> = {
  "Reunião": "bg-blue-100 text-blue-800",
  "Apresentação": "bg-purple-100 text-purple-800",
  "Follow-up": "bg-green-100 text-green-800",
  "Ligação": "bg-yellow-100 text-yellow-800"
};

const statusColors: Record<string, string> = {
  "Confirmado": "bg-green-100 text-green-800",
  "Pendente": "bg-yellow-100 text-yellow-800",
  "Cancelado": "bg-red-100 text-red-800"
};

export const CalendarManager = () => {
  const [events] = useState(mockEvents);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNewEvent = () => {
    console.log("Criando novo evento...");
  };

  const handleEditEvent = (eventId: number) => {
    console.log(`Editando evento ${eventId}...`);
  };

  const handleJoinMeeting = (eventId: number) => {
    console.log(`Entrando na reunião ${eventId}...`);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const todayEvents = events.filter(event => 
    new Date(event.date).toDateString() === new Date().toDateString()
  );

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > new Date()
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600">Gerencie seus compromissos e reuniões</p>
        </div>
        <Button onClick={handleNewEvent} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

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
                <p className="text-2xl font-bold text-green-600">12</p>
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
                <p className="text-2xl font-bold text-purple-600">
                  {events.filter(e => e.type === "Reunião").length}
                </p>
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
                <p className="text-2xl font-bold text-orange-600">
                  {events.filter(e => e.status === "Pendente").length}
                </p>
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
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="aspect-square p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <div className="text-sm">{i + 1 <= 31 ? i + 1 : ''}</div>
                </div>
              ))}
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
                      <Badge className={typeColors[event.type]}>
                        {event.type}
                      </Badge>
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
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
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
                      {event.attendees.length} participantes
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditEvent(event.id)}>
                    Editar
                  </Button>
                  {event.location === "Video call" && (
                    <Button size="sm" onClick={() => handleJoinMeeting(event.id)} className="bg-green-600 hover:bg-green-700">
                      <Video className="w-4 h-4 mr-1" />
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
