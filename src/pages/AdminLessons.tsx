import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
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
  Copy,
  Save,
  X
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('templates');

  // Estados para modais
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);
  const [templates, setTemplates] = useState<LessonTemplate[]>([]);
  const [scheduledLessons, setScheduledLessons] = useState<ScheduledLesson[]>([]);
  const [scheduleFormData, setScheduleFormData] = useState({
    date: '',
    time: '',
    teacher: '',
    student: ''
  });
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Estado para formulário
  const [formData, setFormData] = useState<Partial<LessonTemplate>>({
    title: '',
    type: 'group-beginner',
    theme: '',
    duration: 45,
    difficulty: 'basic',
    status: 'draft'
  });

  // Estados adicionais para UX
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Inicializar templates com mock data
  React.useEffect(() => {
    setTemplates(mockTemplates);
    setScheduledLessons(mockScheduledLessons);
  }, []);

  // Funções de validação
  const validateTemplate = (data: Partial<LessonTemplate>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (data.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!data.theme?.trim()) {
      newErrors.theme = 'Tema é obrigatório';
    }

    if (!data.duration || data.duration < 15) {
      newErrors.duration = 'Duração mínima é 15 minutos';
    } else if (data.duration > 180) {
      newErrors.duration = 'Duração máxima é 180 minutos';
    }

    return newErrors;
  };

  // Funções CRUD para Templates
  const handleCreateTemplate = async () => {
    setIsLoading(true);
    const validationErrors = validateTemplate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTemplate: LessonTemplate = {
        id: Date.now().toString(),
        title: formData.title!,
        type: formData.type!,
        theme: formData.theme!,
        duration: formData.duration!,
        difficulty: formData.difficulty!,
        status: formData.status!,
        createdBy: 'Admin Atual', // Pegar do contexto de auth futuramente
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
        rating: 0
      };

      setTemplates(prev => [...prev, newTemplate]);
      setCreateModalOpen(false);
      resetForm();
      toast({
        title: "Sucesso!",
        description: "Template criado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar template.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    const validationErrors = validateTemplate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTemplates(prev => prev.map(template =>
        template.id === selectedTemplate.id
          ? { ...template, ...formData }
          : template
      ));

      setEditModalOpen(false);
      resetForm();
      toast({
        title: "Sucesso!",
        description: "Template atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar template.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTemplates(prev => prev.filter(template => template.id !== selectedTemplate.id));
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
      toast({
        title: "Sucesso!",
        description: "Template excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir template.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTemplate = (template: LessonTemplate) => {
    const copiedTemplate = {
      ...template,
      title: `${template.title} (Cópia)`,
      status: 'draft' as const,
      usageCount: 0,
      rating: 0
    };
    setFormData(copiedTemplate);
    setCreateModalOpen(true);
    toast({
      title: "Template copiado",
      description: "Template copiado para edição.",
    });
  };

  // Função para abrir modal de agendamento
  const openScheduleModal = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setScheduleFormData({
      date: '',
      time: '',
      teacher: '',
      student: ''
    });
    setAvailabilityError(null);
    setScheduleModalOpen(true);
  };

  // Função para verificar disponibilidade no Google Calendar
  const checkAvailability = async (date: string, time: string): Promise<boolean> => {
    if (!date || !time) return false;

    setIsCheckingAvailability(true);
    setAvailabilityError(null);

    try {
      // Simular chamada ao Google Calendar API
      // Em produção, isso faria uma chamada real à API do Google Calendar
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular verificação de conflito (20% de chance de conflito para demonstração)
      const hasConflict = Math.random() < 0.2;

      if (hasConflict) {
        setAvailabilityError(`❌ Horário não disponível! Já existe uma aula agendada para ${date} às ${time}.`);
        return false;
      }

      // Verificar se é um horário válido (horário comercial)
      const [hours] = time.split(':').map(Number);
      if (hours < 8 || hours > 20) {
        setAvailabilityError('⚠️ Horário fora do horário comercial (8h-20h).');
        return false;
      }

      // Verificar se é uma data futura
      const selectedDate = new Date(`${date}T${time}`);
      const now = new Date();
      if (selectedDate < now) {
        setAvailabilityError('⚠️ Não é possível agendar aulas no passado.');
        return false;
      }

      // Horário disponível
      toast({
        title: "✅ Horário Disponível!",
        description: `${date} às ${time} está livre para agendamento.`,
      });
      return true;
    } catch (error) {
      setAvailabilityError('Erro ao verificar disponibilidade. Tente novamente.');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Função para agendar aula usando o template
  const handleScheduleLesson = async () => {
    if (!selectedTemplate) return;

    const { date, time, teacher, student } = scheduleFormData;

    if (!date || !time || !teacher) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Verificar disponibilidade antes de agendar
    const isAvailable = await checkAvailability(date, time);
    if (!isAvailable) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newScheduledLesson: ScheduledLesson = {
        id: Date.now().toString(),
        templateId: selectedTemplate.id,
        templateTitle: selectedTemplate.title,
        teacher,
        student: student || undefined,
        date,
        time,
        duration: selectedTemplate.duration,
        type: selectedTemplate.type,
        status: 'scheduled',
        credits: selectedTemplate.type.includes('individual') ? 10 : 5
      };

      setScheduledLessons(prev => [...prev, newScheduledLesson]);
      setScheduleModalOpen(false);
      setSelectedTemplate(null);
      toast({
        title: "Sucesso!",
        description: `Aula agendada para ${date} às ${time}.`,
      });

      // Incrementar usage count do template
      setTemplates(prev => prev.map(t =>
        t.id === selectedTemplate.id
          ? { ...t, usageCount: t.usageCount + 1 }
          : t
      ));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao agendar aula.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      title: '',
      type: 'group-beginner',
      theme: '',
      duration: 45,
      difficulty: 'basic',
      status: 'draft'
    });
    setErrors({});
    setIsDirty(false);
    setSelectedTemplate(null);
  };

  const openViewModal = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setViewModalOpen(true);
  };

  const openEditModal = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setFormData(template);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredLessons = scheduledLessons.filter(lesson => {
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
              <div className="text-2xl font-bold">{templates.filter(t => t.status === 'active').length}</div>
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
              <Button onClick={openCreateModal}>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openScheduleModal(template)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Agendar Aula"
                          >
                            <Calendar className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openViewModal(template)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(template)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCopyTemplate(template)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(template)}>
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

        {/* Modal de Visualização */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Template</DialogTitle>
              <DialogDescription>
                Visualize as informações do template de aula.
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tema</Label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.theme}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tipo</Label>
                    <div className="mt-1">{getTypeBadge(selectedTemplate.type)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dificuldade</Label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {selectedTemplate.difficulty === 'basic' && 'Básico'}
                        {selectedTemplate.difficulty === 'intermediate' && 'Intermediário'}
                        {selectedTemplate.difficulty === 'advanced' && 'Avançado'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Duração</Label>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.duration} minutos</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedTemplate.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Criado por</Label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.createdBy}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Usos</Label>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.usageCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Avaliação</Label>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{selectedTemplate.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Criação/Edição */}
        <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {createModalOpen ? 'Novo Template' : 'Editar Template'}
              </DialogTitle>
              <DialogDescription>
                {createModalOpen
                  ? 'Crie um novo template de aula.'
                  : 'Edite as informações do template.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    setIsDirty(true);
                    if (errors.title) {
                      setErrors(prev => ({ ...prev, title: '' }));
                    }
                  }}
                  placeholder="Nome do template"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="theme">Tema *</Label>
                <Input
                  id="theme"
                  value={formData.theme || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, theme: e.target.value }));
                    setIsDirty(true);
                    if (errors.theme) {
                      setErrors(prev => ({ ...prev, theme: '' }));
                    }
                  }}
                  placeholder="Tema da aula"
                  className={errors.theme ? 'border-red-500' : ''}
                />
                {errors.theme && (
                  <p className="text-sm text-red-500 mt-1">{errors.theme}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo de Aula</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, type: value as LessonTemplate['type'] }));
                      setIsDirty(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group-beginner">Grupo Iniciante</SelectItem>
                      <SelectItem value="group-intermediate">Grupo Intermediário</SelectItem>
                      <SelectItem value="group-advanced">Grupo Avançado</SelectItem>
                      <SelectItem value="open-conversation">Conversação Aberta</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, difficulty: value as LessonTemplate['difficulty'] }));
                      setIsDirty(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duração (minutos) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.duration || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }));
                      setIsDirty(true);
                      if (errors.duration) {
                        setErrors(prev => ({ ...prev, duration: '' }));
                      }
                    }}
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, status: value as LessonTemplate['status'] }));
                      setIsDirty(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                resetForm();
              }}>
                Cancelar
              </Button>
              <Button
                onClick={createModalOpen ? handleCreateTemplate : handleUpdateTemplate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                    {createModalOpen ? 'Criando...' : 'Salvando...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {createModalOpen ? 'Criar Template' : 'Salvar Alterações'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o template "{selectedTemplate?.title}"?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTemplate}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de Agendamento de Aula */}
        <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Agendar Aula com Template</DialogTitle>
              <DialogDescription>
                Agende uma aula usando o template: <strong>{selectedTemplate?.title}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Banner de erro de disponibilidade */}
              {availabilityError && (
                <div className="p-3 border-2 border-red-500 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-700">{availabilityError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Data *</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleFormData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setScheduleFormData(prev => ({ ...prev, date: e.target.value }));
                      setAvailabilityError(null);
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="schedule-time">Horário *</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleFormData.time}
                    onChange={(e) => {
                      setScheduleFormData(prev => ({ ...prev, time: e.target.value }));
                      setAvailabilityError(null);
                    }}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="schedule-teacher">Professor *</Label>
                <Input
                  id="schedule-teacher"
                  type="text"
                  value={scheduleFormData.teacher}
                  onChange={(e) => setScheduleFormData(prev => ({ ...prev, teacher: e.target.value }))}
                  placeholder="Nome do professor"
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="schedule-student">Aluno (Opcional)</Label>
                <Input
                  id="schedule-student"
                  type="text"
                  value={scheduleFormData.student}
                  onChange={(e) => setScheduleFormData(prev => ({ ...prev, student: e.target.value }))}
                  placeholder="Nome do aluno (para aulas individuais)"
                  className="w-full"
                />
              </div>

              {/* Informações do Template */}
              <div className="bg-gray-50 p-3 rounded-lg border space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>Duração:</strong> {selectedTemplate?.duration} minutos
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tipo:</strong> {selectedTemplate?.type}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tema:</strong> {selectedTemplate?.theme}
                </p>
              </div>

              {/* Botão de verificar disponibilidade */}
              <Button
                type="button"
                variant="outline"
                onClick={() => checkAvailability(scheduleFormData.date, scheduleFormData.time)}
                disabled={!scheduleFormData.date || !scheduleFormData.time || isCheckingAvailability}
                className="w-full"
              >
                {isCheckingAvailability ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                    Verificando disponibilidade...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Verificar Disponibilidade
                  </>
                )}
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setScheduleModalOpen(false);
                setAvailabilityError(null);
              }}>
                Cancelar
              </Button>
              <Button
                onClick={handleScheduleLesson}
                disabled={isLoading || !scheduleFormData.date || !scheduleFormData.time || !scheduleFormData.teacher}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Aula
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default AdminLessons;