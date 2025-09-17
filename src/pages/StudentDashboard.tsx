import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  CreditCard,
  BookOpen,
  Bell,
  Target,
  MessageCircle,
  Bot,
  TrendingUp,
  Award,
  Users,
  PlayCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [credits, setCredits] = useState(8);
  const [hasLowCredits, setHasLowCredits] = useState(false);
  const [learningProgress, setLearningProgress] = useState({
    currentLevel: 'Intermediate',
    completedLessons: 45,
    totalLessons: 120,
    streakDays: 12,
    totalHours: 48.5
  });

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Estudante',
    email: user.email || '',
    level: user.user_metadata?.level || 'Intermediate'
  } : null;

  useEffect(() => {
    setHasLowCredits(credits <= 2);
  }, [credits]);

  const upcomingLessons = [
    {
      title: "Conversação - Business English",
      teacher: "Prof. Ana Silva",
      date: "Hoje",
      time: "10:30 - 11:15",
      type: "individual",
      credits: 3
    },
    {
      title: "Grupo Intermediário - Travel & Culture",
      teacher: "Prof. Carlos Oliveira",
      date: "Amanhã",
      time: "14:00 - 15:00",
      type: "group",
      credits: 1
    }
  ];

  const achievements = [
    { icon: "🔥", title: "12 dias seguidos", description: "Sequência atual de estudos" },
    { icon: "📚", title: "45 aulas completas", description: "Total de aulas assistidas" },
    { icon: "⭐", title: "Nível Intermediário", description: "Parabéns pelo progresso!" },
    { icon: "💬", title: "Forum Ativo", description: "15 discussões participadas" }
  ];

  const recommendedActions = [
    {
      title: "Continue sua trilha",
      description: "Próxima: Business Communication",
      action: () => navigate('/learning'),
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Pratique conversação",
      description: "Use o AI Chat para praticar",
      action: () => navigate('/ai-chat'),
      icon: Bot,
      color: "bg-green-500"
    },
    {
      title: "Participe do fórum",
      description: "Tire dúvidas com a comunidade",
      action: () => navigate('/forum'),
      icon: MessageCircle,
      color: "bg-purple-500"
    }
  ];

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header do estudante */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Olá, {userData.name}! 👋
          </h1>
          <p className="text-muted-foreground">Continue sua jornada de aprendizado</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            {userData.level}
          </Badge>
          <Button onClick={() => navigate('/catalog')} className="bg-gradient-to-r from-blue-500 to-cyan-500">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Aula
          </Button>
        </div>
      </div>

      {/* Alerta de créditos baixos */}
      {hasLowCredits && (
        <Alert className="border-orange-200 bg-orange-50">
          <Bell className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Créditos Baixos</AlertTitle>
          <AlertDescription className="text-orange-700">
            Você tem apenas {credits} créditos restantes.
            <Button
              variant="link"
              className="px-1 text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/credits')}
            >
              Comprar mais créditos →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{credits}</div>
            <p className="text-xs text-muted-foreground">Disponíveis para aulas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((learningProgress.completedLessons / learningProgress.totalLessons) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {learningProgress.completedLessons}/{learningProgress.totalLessons} aulas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{learningProgress.streakDays}</div>
            <p className="text-xs text-muted-foreground">Dias consecutivos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{learningProgress.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Total estudado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas aulas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximas Aulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLessons.map((lesson, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.teacher}</p>
                  <p className="text-sm text-blue-600">{lesson.date}, {lesson.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={lesson.type === 'individual' ? 'default' : 'secondary'}>
                    {lesson.credits} crédito{lesson.credits > 1 ? 's' : ''}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Entrar
                  </Button>
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate('/schedule')}
            >
              Ver todas as aulas
            </Button>
          </CardContent>
        </Card>

        {/* Progresso atual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Seu Progresso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Trilha Atual</span>
                <span>{Math.round((learningProgress.completedLessons / learningProgress.totalLessons) * 100)}%</span>
              </div>
              <Progress
                value={(learningProgress.completedLessons / learningProgress.totalLessons) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {learningProgress.completedLessons} de {learningProgress.totalLessons} aulas completas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-sm font-medium">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
              onClick={() => navigate('/learning')}
            >
              <Target className="h-4 w-4 mr-2" />
              Continuar Estudando
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ações recomendadas */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendado para Você</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={action.action}
              >
                <div className={`p-3 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;