import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  MessageSquare,
  Settings,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Award
} from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 24,
    activeStudents: 18,
    todaysLessons: 5,
    weeklyLessons: 28,
    monthlyEarnings: 2850,
    rating: 4.8,
    completedLessons: 156,
    upcomingLessons: 8
  });

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Professor',
    email: user.email || '',
    specialization: user.user_metadata?.specialization || 'English Teacher'
  } : null;

  const todaysSchedule = [
    {
      time: "09:00 - 09:45",
      student: "Maria Silva",
      type: "Individual",
      level: "Intermediate",
      topic: "Business Conversation",
      status: "confirmed"
    },
    {
      time: "10:30 - 11:15",
      student: "João Santos",
      type: "Individual",
      level: "Advanced",
      topic: "IELTS Preparation",
      status: "confirmed"
    },
    {
      time: "14:00 - 15:00",
      student: "Grupo Iniciante",
      type: "Group (6 alunos)",
      level: "Beginner",
      topic: "Family & Relationships",
      status: "confirmed"
    },
    {
      time: "15:30 - 16:15",
      student: "Ana Costa",
      type: "Individual",
      level: "Intermediate",
      topic: "Travel English",
      status: "pending"
    },
    {
      time: "19:00 - 20:00",
      student: "Grupo Avançado",
      type: "Group (4 alunos)",
      level: "Advanced",
      topic: "Technology & Future",
      status: "confirmed"
    }
  ];

  const studentProgress = [
    {
      name: "Maria Silva",
      level: "Intermediate",
      progress: 75,
      lastLesson: "2 dias atrás",
      nextLesson: "Amanhã, 14:00"
    },
    {
      name: "João Santos",
      level: "Advanced",
      progress: 90,
      lastLesson: "Ontem",
      nextLesson: "Hoje, 10:30"
    },
    {
      name: "Ana Costa",
      level: "Beginner",
      progress: 45,
      lastLesson: "1 semana atrás",
      nextLesson: "Hoje, 15:30"
    },
    {
      name: "Carlos Oliveira",
      level: "Intermediate",
      progress: 60,
      lastLesson: "3 dias atrás",
      nextLesson: "Amanhã, 16:00"
    }
  ];

  const quickActions = [
    {
      title: "Gerenciar Disponibilidade",
      description: "Definir horários livres",
      action: () => navigate('/teaching'),
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: "Templates de Aula",
      description: "Criar nova aula",
      action: () => navigate('/teaching'),
      icon: BookOpen,
      color: "bg-green-500"
    },
    {
      title: "Forum da Comunidade",
      description: "Responder perguntas",
      action: () => navigate('/forum'),
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      title: "Perfil & Configurações",
      description: "Atualizar informações",
      action: () => navigate('/profile'),
      icon: Settings,
      color: "bg-gray-500"
    }
  ];

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header do professor */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Bem-vindo, Prof. {userData.name}! 👨‍🏫
          </h1>
          <p className="text-muted-foreground">Gerencie suas aulas e acompanhe seus alunos</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            ⭐ {stats.rating}/5.0
          </Badge>
          <Button onClick={() => navigate('/teaching')} className="bg-gradient-to-r from-green-500 to-emerald-500">
            <Calendar className="h-4 w-4 mr-2" />
            Gerenciar Aulas
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todaysLessons}</div>
            <p className="text-xs text-muted-foreground">{stats.weeklyLessons} esta semana</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">de {stats.totalStudents} total</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ {stats.monthlyEarnings}</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.rating}/5.0</div>
            <p className="text-xs text-muted-foreground">{stats.completedLessons} aulas completas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda de hoje */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysSchedule.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{lesson.student}</h4>
                    <Badge variant={lesson.type.includes('Group') ? 'secondary' : 'default'} className="text-xs">
                      {lesson.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                  <p className="text-sm text-blue-600">{lesson.time} • {lesson.level}</p>
                </div>
                <div className="flex items-center gap-3">
                  {lesson.status === 'confirmed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  <Button size="sm" variant="outline">
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate('/teaching')}
            >
              Ver agenda completa
            </Button>
          </CardContent>
        </Card>

        {/* Progresso dos alunos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Progresso dos Alunos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentProgress.map((student, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{student.name}</h4>
                  <Badge variant="outline" className="text-xs">{student.level}</Badge>
                </div>
                <Progress value={student.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Última: {student.lastLesson}</span>
                  <span>{student.progress}%</span>
                </div>
                <p className="text-xs text-blue-600">Próxima: {student.nextLesson}</p>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => navigate('/teaching')}
            >
              Ver todos os alunos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={action.action}
              >
                <div className={`p-4 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Conquistas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-medium">Meta de Aulas Atingida</h4>
                <p className="text-sm text-muted-foreground">28/25 aulas esta semana</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl">⭐</div>
              <div>
                <h4 className="font-medium">Avaliação Excelente</h4>
                <p className="text-sm text-muted-foreground">4.8/5.0 de média</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl">💬</div>
              <div>
                <h4 className="font-medium">Participação no Fórum</h4>
                <p className="text-sm text-muted-foreground">12 respostas úteis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Feedback Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm">"Professora excelente! Muito paciente e didática."</p>
              <p className="text-xs text-muted-foreground">- Maria Silva (⭐⭐⭐⭐⭐)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm">"As aulas são muito dinâmicas e interessantes."</p>
              <p className="text-xs text-muted-foreground">- João Santos (⭐⭐⭐⭐⭐)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm">"Ótima metodologia, aprendo muito a cada aula!"</p>
              <p className="text-xs text-muted-foreground">- Ana Costa (⭐⭐⭐⭐⭐)</p>
            </div>
            <Button variant="link" className="p-0 text-blue-600">
              Ver todos os feedbacks →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;