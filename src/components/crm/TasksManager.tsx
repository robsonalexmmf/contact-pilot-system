
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Filter,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { NewTaskDialog } from "./NewTaskDialog";

const mockTasks = [
  {
    id: 1,
    title: "Follow-up com Maria Santos",
    description: "Entrar em contato para agendar apresentação",
    priority: "Alta",
    status: "Pendente",
    assignee: "João Silva",
    dueDate: "2024-01-16",
    type: "Follow-up",
    completed: false
  },
  {
    id: 2,
    title: "Enviar proposta para StartupTech",
    description: "Finalizar e enviar proposta comercial personalizada",
    priority: "Média",
    status: "Em Andamento",
    assignee: "Ana Costa",
    dueDate: "2024-01-17",
    type: "Proposta",
    completed: false
  },
  {
    id: 3,
    title: "Reunião de negociação - ABC Corp",
    description: "Reunião para negociar termos do contrato",
    priority: "Alta",
    status: "Agendada",
    assignee: "Pedro Oliveira",
    dueDate: "2024-01-18",
    type: "Reunião",
    completed: false
  },
  {
    id: 4,
    title: "Pesquisa de mercado - Setor Varejo",
    description: "Análise de concorrentes e oportunidades",
    priority: "Baixa",
    status: "Concluída",
    assignee: "Maria Santos",
    dueDate: "2024-01-15",
    type: "Pesquisa",
    completed: true
  }
];

const priorityColors: Record<string, string> = {
  "Alta": "bg-red-100 text-red-800",
  "Média": "bg-yellow-100 text-yellow-800",
  "Baixa": "bg-green-100 text-green-800"
};

const statusColors: Record<string, string> = {
  "Pendente": "bg-gray-100 text-gray-800",
  "Em Andamento": "bg-blue-100 text-blue-800",
  "Agendada": "bg-purple-100 text-purple-800",
  "Concluída": "bg-green-100 text-green-800"
};

export const TasksManager = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState("all");

  const handleCreateTask = (newTask: any) => {
    setTasks(prev => [...prev, newTask]);
    console.log("Tarefa adicionada:", newTask);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: task.completed ? "Pendente" : "Concluída" }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "overdue":
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  const getOverdueTasks = () => tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  );

  const getPendingTasks = () => tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{getPendingTasks().length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">{getOverdueTasks().length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === "overdue" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("overdue")}
          >
            Em Atraso
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Concluídas
          </Button>
        </div>

        <NewTaskDialog onCreateTask={handleCreateTask} />
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`transition-all ${task.completed ? 'opacity-75' : 'hover:shadow-md'}`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {task.assignee}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                    {!task.completed && new Date(task.dueDate) < new Date() && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Atrasada
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === "completed" 
              ? "Ainda não há tarefas concluídas"
              : filter === "overdue"
              ? "Nenhuma tarefa em atraso"
              : "Comece criando sua primeira tarefa"
            }
          </p>
          <NewTaskDialog 
            onCreateTask={handleCreateTask}
            trigger={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};
