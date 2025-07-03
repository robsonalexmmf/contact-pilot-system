
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Play, 
  Award,
  Clock,
  Users,
  Star,
  CheckCircle,
  Plus,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const mockCourses = [
  {
    id: 1,
    title: "Fundamentos do CRM",
    description: "Aprenda os conceitos básicos para usar o sistema eficientemente",
    duration: "2h 30min",
    lessons: 8,
    level: "Básico",
    progress: 75,
    completed: false,
    rating: 4.8,
    students: 156
  },
  {
    id: 2,
    title: "Automação Avançada",
    description: "Domine as ferramentas de automação e workflows",
    duration: "3h 45min",
    lessons: 12,
    level: "Avançado",
    progress: 30,
    completed: false,
    rating: 4.9,
    students: 89
  },
  {
    id: 3,
    title: "Relatórios e Analytics",
    description: "Crie relatórios personalizados e analise dados",
    duration: "1h 50min",
    lessons: 6,
    level: "Intermediário",
    progress: 100,
    completed: true,
    rating: 4.7,
    students: 124
  }
];

const mockAchievements = [
  {
    id: 1,
    title: "Primeiro Login",
    description: "Fez o primeiro acesso ao sistema",
    icon: "🎯",
    earned: true,
    date: "2024-01-10"
  },
  {
    id: 2,
    title: "Expert em Leads",
    description: "Completou o curso de gestão de leads",
    icon: "👑",
    earned: true,
    date: "2024-01-12"
  },
  {
    id: 3,
    title: "Master de Automação",
    description: "Criou 10 automações diferentes",
    icon: "⚡",
    earned: false,
    date: null
  }
];

export const Academy = () => {
  const [courses] = useState(mockCourses);
  const [achievements] = useState(mockAchievements);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCourses = courses.filter(c => c.completed).length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessons, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return "bg-green-100 text-green-800";
      case "Intermediário":
        return "bg-yellow-100 text-yellow-800";
      case "Avançado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CRM Academy</h2>
          <p className="text-gray-600">Treinamentos e certificações para sua equipe</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Criar Curso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cursos Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{completedCourses}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Aulas</p>
                <p className="text-2xl font-bold text-blue-600">{totalLessons}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conquistas</p>
                <p className="text-2xl font-bold text-purple-600">{earnedAchievements}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold text-orange-600">8h 5min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getLevelColor(course.level)}>
                    {course.level}
                  </Badge>
                </div>
                {course.completed && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-500" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Play className="w-4 h-4 mr-1 text-gray-500" />
                      {course.lessons} aulas
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span>{course.students} alunos</span>
                  </div>
                </div>

                {!course.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {course.completed ? "Revisar" : course.progress > 0 ? "Continuar" : "Iniciar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 border rounded-lg ${achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {achievement.earned ? achievement.icon : "🔒"}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Conquistado em {new Date(achievement.date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
