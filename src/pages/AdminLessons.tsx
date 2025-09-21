import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

interface LessonTemplate {
  id: string;
  title: string;
  type: 'group-beginner' | 'group-intermediate' | 'group-advanced' | 'open-conversation' | 'individual';
  theme: string;
  duration: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  createdBy: string;
  createdAt: string;
  usageCount: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
}

interface ScheduledLesson {
  id: string;
  templateId: string;
  templateTitle: string;
  teacher: string;
  student?: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  credits: number;
}

const AdminLessons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('templates');

  // Mock data para templates
  const mockTemplates: LessonTemplate[] = [
    {
      id: '1',
      title: 'Conversação - Relacionamentos Familiares',
      type: 'group-beginner',
      theme: 'relacionamentos-humanos',
      duration: 45,
      difficulty: 'basic',
      createdBy: 'Prof. Ana Silva',
      createdAt: '2024-09-15',
      usageCount: 24,
      rating: 4.8,
      status: 'active'
    },
    {
      id: '2',
      title: 'Business English - Meetings',
      type: 'group-advanced',
      theme: 'trabalho-carreira',
      duration: 60,
      difficulty: 'advanced',
      createdBy: 'Prof. Carlos Santos',
      createdAt: '2024-09-18',
      usageCount: 15,
      rating: 4.9,
      status: 'active'
    },
    {
      id: '3',
      title: 'Vocabulário - Tecnologia',
      type: 'individual',
      theme: 'tecnologia-futuro',
      duration: 30,
      difficulty: 'intermediate',
      createdBy: 'Prof. Maria Costa',
      createdAt: '2024-09-20',
      usageCount: 8,
      rating: 4.6,
      status: 'draft'
    }
  ];

  // Mock data para aulas agendadas
  const mockScheduledLessons: ScheduledLesson[] = [
    {
      id: '1',
      templateId: '1',
      templateTitle: 'Conversação - Relacionamentos Familiares',
      teacher: 'Prof. Ana Silva',
      student: 'João Pedro',
      date: '2024-09-21',
      time: '14:00',
      duration: 45,
      type: 'group-beginner',
      status: 'scheduled',
      credits: 1
    },
    {
      id: '2',
      templateId: '2',
      templateTitle: 'Business English - Meetings',
      teacher: 'Prof. Carlos Santos',
      date: '2024-09-21',
      time: '16:00',
      duration: 60,
      type: 'group-advanced',
      status: 'in-progress',
      credits: 1
    },
    {
      id: '3',
      templateId: '3',
      templateTitle: 'Vocabulário - Tecnologia',
      teacher: 'Prof. Maria Costa',
      student: 'Ana Carolina',
      date: '2024-09-20',
      time: '10:00',
      duration: 30,
      type: 'individual',
      status: 'completed',
      credits: 3
    }
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredLessons = mockScheduledLessons.filter(lesson => {
    const matchesSearch = lesson.templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lesson.student && lesson.student.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'active': 'default',
      'draft': 'secondary',
      'archived': 'outline',
      'scheduled': 'default',
      'completed': 'secondary',
      'cancelled': 'destructive',
      'in-progress': 'outline'
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status === 'active' && 'Ativo'}
        {status === 'draft' && 'Rascunho'}
        {status === 'archived' && 'Arquivado'}
        {status === 'scheduled' && 'Agendada'}
        {status === 'completed' && 'Concluída'}
        {status === 'cancelled' && 'Cancelada'}
        {status === 'in-progress' && 'Em Andamento'}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      'group-beginner': 'Grupo Iniciante',
      'group-intermediate': 'Grupo Intermediário',
      'group-advanced': 'Grupo Avançado',
      'open-conversation': 'Conversação Aberta',
      'individual': 'Individual'
    };

    return <Badge variant="outline">{types[type] || type}</Badge>;
  };

  return (
    <AdminPageLayout
      title="Gerenciamento de Aulas"
      description="Gerencie templates de aulas e agendamentos"
      icon={BookOpen}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTemplates.filter(t => t.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">+2 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">6 agendadas, 2 concluídas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Template Mais Usado</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">usos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">de 5 estrelas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Templates de Aulas</TabsTrigger>
            <TabsTrigger value="scheduled">Aulas Agendadas</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-[300px]"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Tipo de aula" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="group-beginner">Grupo Iniciante</SelectItem>
                    <SelectItem value="group-intermediate">Grupo Intermediário</SelectItem>
                    <SelectItem value="group-advanced">Grupo Avançado</SelectItem>
                    <SelectItem value="open-conversation">Conversação Aberta</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Template
              </Button>
            </div>

            {/* Templates Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Criado por</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{template.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {template.theme}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(template.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration}min
                        </div>
                      </TableCell>
                      <TableCell>{template.createdBy}</TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-400" />
                          {template.rating}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(template.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {/* Filters for scheduled lessons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar aulas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full sm:w-[300px]"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="in-progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agendar Aula
              </Button>
            </div>

            {/* Scheduled Lessons Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aula</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead>Aluno(s)</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lesson.templateTitle}</div>
                          <div className="text-sm text-muted-foreground">
                            {getTypeBadge(lesson.type)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lesson.teacher}</TableCell>
                      <TableCell>
                        {lesson.student || (
                          <span className="text-muted-foreground">
                            {lesson.type.includes('group') ? 'Grupo' : 'Não definido'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{new Date(lesson.date).toLocaleDateString('pt-BR')}</div>
                          <div className="text-sm text-muted-foreground">{lesson.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}min
                        </div>
                      </TableCell>
                      <TableCell>{lesson.credits}</TableCell>
                      <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {lesson.status === 'scheduled' && (
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default AdminLessons;