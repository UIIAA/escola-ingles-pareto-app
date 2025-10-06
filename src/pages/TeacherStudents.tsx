import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Users,
  Search,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Award,
  Eye
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrollmentDate: string;
  totalLessons: number;
  completedLessons: number;
  attendance: number;
  averageGrade: number;
  lastLesson: string;
  nextLesson?: string;
  forumActivity: number;
  achievements: number;
}

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Dados mockados de alunos
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      phone: '(11) 98765-4321',
      level: 'Intermediate',
      enrollmentDate: '2024-01-15',
      totalLessons: 45,
      completedLessons: 42,
      attendance: 93.3,
      averageGrade: 8.5,
      lastLesson: '2024-09-15',
      nextLesson: '2024-09-22',
      forumActivity: 23,
      achievements: 12
    },
    {
      id: '2',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      phone: '(11) 91234-5678',
      level: 'Advanced',
      enrollmentDate: '2023-11-20',
      totalLessons: 78,
      completedLessons: 75,
      attendance: 96.2,
      averageGrade: 9.2,
      lastLesson: '2024-09-14',
      nextLesson: '2024-09-21',
      forumActivity: 45,
      achievements: 24
    },
    {
      id: '3',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 99876-5432',
      level: 'Beginner',
      enrollmentDate: '2024-07-10',
      totalLessons: 12,
      completedLessons: 10,
      attendance: 83.3,
      averageGrade: 7.8,
      lastLesson: '2024-09-13',
      nextLesson: '2024-09-20',
      forumActivity: 8,
      achievements: 4
    },
    {
      id: '4',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '(11) 92345-6789',
      level: 'Intermediate',
      enrollmentDate: '2024-03-05',
      totalLessons: 32,
      completedLessons: 30,
      attendance: 93.8,
      averageGrade: 8.9,
      lastLesson: '2024-09-12',
      forumActivity: 15,
      achievements: 9
    },
    {
      id: '5',
      name: 'Julia Ferreira',
      email: 'julia.ferreira@email.com',
      phone: '(11) 93456-7890',
      level: 'Advanced',
      enrollmentDate: '2023-09-18',
      totalLessons: 89,
      completedLessons: 87,
      attendance: 97.8,
      averageGrade: 9.5,
      lastLesson: '2024-09-11',
      nextLesson: '2024-09-18',
      forumActivity: 56,
      achievements: 28
    },
    {
      id: '6',
      name: 'Ricardo Souza',
      email: 'ricardo.souza@email.com',
      phone: '(11) 94567-8901',
      level: 'Beginner',
      enrollmentDate: '2024-08-22',
      totalLessons: 8,
      completedLessons: 7,
      attendance: 87.5,
      averageGrade: 7.2,
      lastLesson: '2024-09-10',
      nextLesson: '2024-09-17',
      forumActivity: 3,
      achievements: 2
    },
    {
      id: '7',
      name: 'Beatriz Alves',
      email: 'beatriz.alves@email.com',
      phone: '(11) 95678-9012',
      level: 'Intermediate',
      enrollmentDate: '2024-02-28',
      totalLessons: 38,
      completedLessons: 36,
      attendance: 94.7,
      averageGrade: 8.7,
      lastLesson: '2024-09-09',
      nextLesson: '2024-09-16',
      forumActivity: 19,
      achievements: 11
    },
    {
      id: '8',
      name: 'Fernando Lima',
      email: 'fernando.lima@email.com',
      phone: '(11) 96789-0123',
      level: 'Advanced',
      enrollmentDate: '2023-10-12',
      totalLessons: 72,
      completedLessons: 68,
      attendance: 94.4,
      averageGrade: 9.0,
      lastLesson: '2024-09-08',
      forumActivity: 38,
      achievements: 21
    }
  ];

  // Filtrar alunos
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'all' || student.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  // Estatísticas gerais
  const stats = {
    total: mockStudents.length,
    beginner: mockStudents.filter(s => s.level === 'Beginner').length,
    intermediate: mockStudents.filter(s => s.level === 'Intermediate').length,
    advanced: mockStudents.filter(s => s.level === 'Advanced').length,
    avgAttendance: (mockStudents.reduce((sum, s) => sum + s.attendance, 0) / mockStudents.length).toFixed(1),
    avgGrade: (mockStudents.reduce((sum, s) => sum + s.averageGrade, 0) / mockStudents.length).toFixed(1)
  };

  const getLevelBadge = (level: string) => {
    const config = {
      Beginner: { label: 'Iniciante', variant: 'secondary' as const, className: 'bg-green-500 text-white' },
      Intermediate: { label: 'Intermediário', variant: 'default' as const, className: 'bg-blue-500 text-white' },
      Advanced: { label: 'Avançado', variant: 'default' as const, className: 'bg-purple-500 text-white' }
    };

    const { label, variant, className } = config[level as keyof typeof config];
    return <Badge variant={variant} className={className}>{label}</Badge>;
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Meus Alunos
          </h1>
          <p className="text-muted-foreground">Gerencie e acompanhe o progresso dos seus alunos</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Alunos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Iniciantes</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.beginner}</div>
            <p className="text-xs text-muted-foreground">Nível básico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intermediários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.intermediate}</div>
            <p className="text-xs text-muted-foreground">Nível médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avançados</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.advanced}</div>
            <p className="text-xs text-muted-foreground">Nível alto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequência Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Nota média: {stats.avgGrade}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>Visualize e gerencie todos os seus alunos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="Beginner">Iniciante</SelectItem>
                <SelectItem value="Intermediate">Intermediário</SelectItem>
                <SelectItem value="Advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de Cards de Alunos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground py-8">
                Nenhum aluno encontrado
              </div>
            ) : (
              filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(student)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </CardDescription>
                      </div>
                      {getLevelBadge(student.level)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequência:</span>
                      <span className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nota Média:</span>
                      <span className="font-semibold">{student.averageGrade}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso:</span>
                        <span className="text-sm font-medium">
                          {student.completedLessons}/{student.totalLessons}
                        </span>
                      </div>
                      <Progress value={(student.completedLessons / student.totalLessons) * 100} className="h-2" />
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {student.forumActivity} posts
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {student.achievements} conquistas
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(student);
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Resumo */}
          <div className="flex justify-between items-center text-sm text-muted-foreground pt-4">
            <span>Mostrando {filteredStudents.length} de {mockStudents.length} alunos</span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes do Aluno */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
            <DialogDescription>
              Informações completas e histórico
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="performance">Desempenho</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-lg font-semibold">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nível</label>
                    <div className="mt-1">{getLevelBadge(selectedStudent.level)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Matrícula</label>
                    <p>{selectedStudent.enrollmentDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Aula</label>
                    <p>{selectedStudent.lastLesson}</p>
                  </div>
                  {selectedStudent.nextLesson && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Próxima Aula</label>
                      <p>{selectedStudent.nextLesson}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total de Aulas</label>
                    <p>{selectedStudent.totalLessons} aulas</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Métricas de Desempenho</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Frequência</span>
                          <span className={`text-sm font-bold ${getAttendanceColor(selectedStudent.attendance)}`}>
                            {selectedStudent.attendance.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={selectedStudent.attendance} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progresso</span>
                          <span className="text-sm font-bold">
                            {((selectedStudent.completedLessons / selectedStudent.totalLessons) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(selectedStudent.completedLessons / selectedStudent.totalLessons) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Nota Média</span>
                          <span className="text-sm font-bold">{selectedStudent.averageGrade}/10</span>
                        </div>
                        <Progress value={selectedStudent.averageGrade * 10} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Atividade no Fórum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedStudent.forumActivity}</div>
                        <p className="text-xs text-muted-foreground">Posts e respostas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Conquistas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedStudent.achievements}</div>
                        <p className="text-xs text-muted-foreground">Badges obtidos</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{selectedStudent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p>{selectedStudent.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Mensagem
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherStudents;
