import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Star,
  DollarSign,
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Mail,
  Phone,
  Search,
  Filter,
  MoreHorizontal,
  Award,
  Target
} from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  totalStudents: number;
  totalLessons: number;
  completedLessons: number;
  hoursTeaching: number;
  monthlyEarnings: number;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'vacation';
  languages: string[];
  certifications: string[];
}

const AdminTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dados mockados expandidos
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana@inglespareto.com',
      phone: '+55 11 99999-1111',
      specialty: 'Conversação',
      rating: 4.9,
      totalStudents: 24,
      totalLessons: 156,
      completedLessons: 152,
      hoursTeaching: 78,
      monthlyEarnings: 5480,
      joinDate: '2024-01-15',
      lastActive: '2024-09-18',
      status: 'active',
      languages: ['Português', 'Inglês', 'Espanhol'],
      certifications: ['TEFL', 'Cambridge CELTA']
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao@inglespareto.com',
      phone: '+55 11 99999-2222',
      specialty: 'Gramática',
      rating: 4.8,
      totalStudents: 18,
      totalLessons: 124,
      completedLessons: 120,
      hoursTeaching: 62,
      monthlyEarnings: 4320,
      joinDate: '2024-02-20',
      lastActive: '2024-09-17',
      status: 'active',
      languages: ['Português', 'Inglês'],
      certifications: ['TESOL', 'Trinity TESOL']
    },
    {
      id: '3',
      name: 'Maria Costa',
      email: 'maria@inglespareto.com',
      phone: '+55 11 99999-3333',
      specialty: 'Business English',
      rating: 4.7,
      totalStudents: 22,
      totalLessons: 134,
      completedLessons: 128,
      hoursTeaching: 67,
      monthlyEarnings: 4180,
      joinDate: '2024-01-10',
      lastActive: '2024-09-18',
      status: 'active',
      languages: ['Português', 'Inglês', 'Francês'],
      certifications: ['TEFL', 'Business English Specialist']
    },
    {
      id: '4',
      name: 'Pedro Oliveira',
      email: 'pedro@inglespareto.com',
      phone: '+55 11 99999-4444',
      specialty: 'Preparatório',
      rating: 4.6,
      totalStudents: 15,
      totalLessons: 89,
      completedLessons: 85,
      hoursTeaching: 45,
      monthlyEarnings: 3200,
      joinDate: '2024-03-05',
      lastActive: '2024-09-15',
      status: 'vacation',
      languages: ['Português', 'Inglês'],
      certifications: ['IELTS Specialist', 'TOEFL Certified']
    },
    {
      id: '5',
      name: 'Sofia Mendes',
      email: 'sofia@inglespareto.com',
      phone: '+55 11 99999-5555',
      specialty: 'Iniciantes',
      rating: 4.5,
      totalStudents: 28,
      totalLessons: 145,
      completedLessons: 140,
      hoursTeaching: 72,
      monthlyEarnings: 3850,
      joinDate: '2024-02-01',
      lastActive: '2024-09-10',
      status: 'inactive',
      languages: ['Português', 'Inglês'],
      certifications: ['TEFL', 'Young Learners Specialist']
    }
  ];

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || teacher.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      vacation: 'outline'
    } as const;

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      vacation: 'Férias'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-500 fill-current" />
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  // Estatísticas gerais
  const stats = {
    totalTeachers: mockTeachers.length,
    activeTeachers: mockTeachers.filter(t => t.status === 'active').length,
    averageRating: mockTeachers.reduce((sum, t) => sum + t.rating, 0) / mockTeachers.length,
    totalEarnings: mockTeachers.reduce((sum, t) => sum + t.monthlyEarnings, 0),
    totalStudents: mockTeachers.reduce((sum, t) => sum + t.totalStudents, 0),
    totalHours: mockTeachers.reduce((sum, t) => sum + t.hoursTeaching, 0)
  };

  return (
    <AdminPageLayout
      title="Gerenciamento de Professores"
      description="Visualize e gerencie todos os professores da plataforma"
    >
      {/* Estatísticas dos Professores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTeachers} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Satisfação geral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Atendidos pelos professores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filtros e Busca
            </div>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Novo Professor
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas especialidades</SelectItem>
                <SelectItem value="Conversação">Conversação</SelectItem>
                <SelectItem value="Gramática">Gramática</SelectItem>
                <SelectItem value="Business English">Business English</SelectItem>
                <SelectItem value="Preparatório">Preparatório</SelectItem>
                <SelectItem value="Iniciantes">Iniciantes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="vacation">Férias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Professores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} />
                    <AvatarFallback>
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <CardDescription>{teacher.specialty}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(teacher.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating e Estatísticas */}
              <div className="flex items-center justify-between">
                {getRatingStars(teacher.rating)}
                <Badge variant="outline" className="text-xs">
                  {teacher.totalStudents} alunos
                </Badge>
              </div>

              {/* Progress das aulas */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Aulas Concluídas</span>
                  <span>{teacher.completedLessons}/{teacher.totalLessons}</span>
                </div>
                <Progress
                  value={(teacher.completedLessons / teacher.totalLessons) * 100}
                  className="h-2"
                />
              </div>

              {/* Informações de contato */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-3 w-3 mr-2" />
                  {teacher.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-3 w-3 mr-2" />
                  {teacher.phone}
                </div>
              </div>

              {/* Métricas financeiras */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    R$ {teacher.monthlyEarnings.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {teacher.hoursTeaching}h
                  </div>
                  <div className="text-xs text-muted-foreground">Lecionadas</div>
                </div>
              </div>

              {/* Certificações */}
              <div className="flex flex-wrap gap-1">
                {teacher.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Detalhados dos Professores</CardTitle>
          <CardDescription>
            {filteredTeachers.length} professor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professor</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Aulas</TableHead>
                <TableHead>Ganhos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} />
                        <AvatarFallback className="text-xs">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">{teacher.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.specialty}</TableCell>
                  <TableCell>{getRatingStars(teacher.rating)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.totalStudents}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{teacher.completedLessons}/{teacher.totalLessons}</div>
                      <div className="text-muted-foreground">{teacher.hoursTeaching}h</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    R$ {teacher.monthlyEarnings.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(teacher.lastActive).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
};

export default AdminTeachers;