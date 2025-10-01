import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TeacherScheduling from '@/components/TeacherScheduling';
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
  Award,
  Eye,
  Plus
} from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const [allStudentsModalOpen, setAllStudentsModalOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);
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

  // Função para abrir detalhes do aluno
  const openStudentDetails = (studentName: string) => {
    // Buscar histórico de aulas do aluno (simulated data)
    const studentHistory = {
      name: studentName,
      level: studentProgress.find(s => s.name === studentName)?.level || "Intermediate",
      totalLessons: 42,
      lastLessons: [
        { date: "2025-09-28", time: "14:00", topic: "Business Conversation", duration: "45 min", status: "completed" },
        { date: "2025-09-25", time: "10:00", topic: "Grammar - Past Perfect", duration: "60 min", status: "completed" },
        { date: "2025-09-21", time: "15:30", topic: "IELTS Speaking Practice", duration: "45 min", status: "completed" },
        { date: "2025-09-18", time: "14:00", topic: "Vocabulary Building", duration: "45 min", status: "completed" },
        { date: "2025-09-15", time: "10:30", topic: "Pronunciation Workshop", duration: "60 min", status: "completed" }
      ],
      upcomingLessons: [
        { date: "2025-10-01", time: "14:00", topic: "Business Negotiation", duration: "45 min", status: "scheduled" },
        { date: "2025-10-04", time: "10:00", topic: "Advanced Grammar", duration: "60 min", status: "scheduled" }
      ],
      progress: studentProgress.find(s => s.name === studentName)?.progress || 75,
      attendance: "95%",
      averageScore: 8.5
    };

    setSelectedStudent(studentHistory);
    setStudentDetailsOpen(true);
  };

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
          <Button onClick={() => setSchedulingOpen(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="h-4 w-4 mr-2" />
            Agendar Nova Aula
          </Button>
          <Button onClick={() => navigate('/teaching')} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openStudentDetails(lesson.student)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
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
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{student.name}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openStudentDetails(student.name)}
                      className="h-6 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
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
              onClick={() => setAllStudentsModalOpen(true)}
            >
              <Users className="h-4 w-4 mr-2" />
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

      {/* Modal de todos os alunos */}
      <Dialog open={allStudentsModalOpen} onOpenChange={setAllStudentsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Todos os Alunos ({studentProgress.length})</DialogTitle>
            <DialogDescription>
              Lista completa de alunos e seus progressos
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentProgress.map((student, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{student.name}</h3>
                      <Badge variant="outline" className="mt-1 text-xs">{student.level}</Badge>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso:</span>
                          <span className="font-medium">{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Próxima aula: {student.nextLesson}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setAllStudentsModalOpen(false);
                      openStudentDetails(student.name);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes Completos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Aluno */}
      <Dialog open={studentDetailsOpen} onOpenChange={setStudentDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno: {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Histórico de aulas e progresso detalhado
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Estatísticas gerais */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.totalLessons}</p>
                    <p className="text-xs text-muted-foreground">Total de Aulas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedStudent.progress}%</p>
                    <p className="text-xs text-muted-foreground">Progresso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedStudent.attendance}</p>
                    <p className="text-xs text-muted-foreground">Frequência</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedStudent.averageScore}</p>
                    <p className="text-xs text-muted-foreground">Nota Média</p>
                  </CardContent>
                </Card>
              </div>

              {/* Últimas aulas */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Últimas 5 Aulas
                </h3>
                <div className="space-y-2">
                  {selectedStudent.lastLessons.map((lesson: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="font-medium text-sm">{lesson.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.date} às {lesson.time} • {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-green-50">
                        Concluída
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximas aulas */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Próximas Aulas Agendadas
                </h3>
                <div className="space-y-2">
                  {selectedStudent.upcomingLessons.map((lesson: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{lesson.topic}</p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.date} às {lesson.time} • {lesson.duration}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                        Agendada
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Informações do Aluno</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nível:</strong> {selectedStudent.level}</p>
                  <p><strong>Progresso:</strong> {selectedStudent.progress}%</p>
                  <p><strong>Frequência:</strong> {selectedStudent.attendance}</p>
                  <p><strong>Nota Média:</strong> {selectedStudent.averageScore}/10</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setStudentDetailsOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => navigate('/teaching')}>
              Ver Todas as Aulas
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Agendamento */}
      <TeacherScheduling
        open={schedulingOpen}
        onOpenChange={setSchedulingOpen}
      />
    </div>
  );
};

export default TeacherDashboard;