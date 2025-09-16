import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  BookOpen,
  Users,
  Clock,
  CreditCard,
  Plus,
  Search,
  Calendar,
  Save,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';

import {
  ALL_LESSON_TEMPLATES,
  getTemplateById
} from '../data/lesson-templates';
import {
  LessonTemplate,
  UNIVERSAL_THEMES,
  CreatedLesson,
  LessonType,
  DifficultyLevel
} from '../types/lesson-templates';

const TeacherLessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LessonType | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(null);

  // Form state for creating lessons
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: [''],
    materials: [''],
    prerequisites: '',
    datetime: '',
  });

  // Mock data for created lessons - will be replaced with real data
  const [createdLessons, setCreatedLessons] = useState<CreatedLesson[]>([]);

  // Mock teacher data
  const teacherId = 'teacher_123';

  // Filter templates for selection
  const filteredTemplates = useMemo(() => {
    let templates = ALL_LESSON_TEMPLATES;

    if (searchQuery.trim()) {
      templates = templates.filter(template =>
        template.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.grammarFocus.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      templates = templates.filter(template => template.type === selectedType);
    }

    return templates;
  }, [searchQuery, selectedType]);

  const getTypeLabel = (type: LessonType): string => {
    switch (type) {
      case 'group-beginner': return 'Grupo Iniciante';
      case 'group-intermediate': return 'Grupo Intermediário';
      case 'group-advanced': return 'Grupo Avançado';
      case 'open-conversation': return 'Conversação Aberta';
      case 'individual': return 'Individual';
    }
  };

  const getTypeColor = (type: LessonType): string => {
    switch (type) {
      case 'group-beginner': return 'bg-green-100 text-green-800';
      case 'group-intermediate': return 'bg-blue-100 text-blue-800';
      case 'group-advanced': return 'bg-purple-100 text-purple-800';
      case 'open-conversation': return 'bg-orange-100 text-orange-800';
      case 'individual': return 'bg-pink-100 text-pink-800';
    }
  };

  const handleTemplateSelect = (template: LessonTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: '',
      description: '',
      objectives: [''],
      materials: [''],
      prerequisites: '',
      datetime: '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, '']
    });
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData({ ...formData, objectives: newObjectives });
    }
  };

  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, '']
    });
  };

  const removeMaterial = (index: number) => {
    if (formData.materials.length > 1) {
      const newMaterials = formData.materials.filter((_, i) => i !== index);
      setFormData({ ...formData, materials: newMaterials });
    }
  };

  const handleCreateLesson = () => {
    if (!selectedTemplate) return;

    const newLesson: CreatedLesson = {
      id: `lesson_${Date.now()}`,
      templateId: selectedTemplate.id,
      teacherId,
      title: formData.title,
      description: formData.description,
      objectives: formData.objectives.filter(obj => obj.trim() !== ''),
      materials: formData.materials.filter(mat => mat.trim() !== ''),
      prerequisites: formData.prerequisites,
      datetime: formData.datetime,
      status: 'available',
      enrolledStudents: [],
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCreatedLessons([...createdLessons, newLesson]);
    setIsCreateDialogOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criação de Aulas</h1>
          <p className="text-gray-600 mt-2">
            Crie aulas baseadas em nossos templates pré-definidos
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{createdLessons.length}</div>
          <div className="text-sm text-gray-600">Aulas Criadas</div>
        </div>
      </div>

      {/* Created Lessons */}
      {createdLessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Minhas Aulas Criadas</CardTitle>
            <CardDescription>Gerencie suas aulas baseadas nos templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdLessons.map((lesson) => (
                <Card key={lesson.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className={getTypeColor(lesson.template.type)}>
                        {getTypeLabel(lesson.template.type)}
                      </Badge>
                      <Badge variant={lesson.status === 'available' ? 'default' : 'secondary'}>
                        {lesson.status === 'available' ? 'Disponível' : lesson.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {UNIVERSAL_THEMES[lesson.template.theme].name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{lesson.datetime ? new Date(lesson.datetime).toLocaleString('pt-BR') : 'Não agendado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>{lesson.enrolledStudents.length}/{lesson.template.maxStudents} alunos</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit3 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Template</CardTitle>
          <CardDescription>
            Escolha um template para criar uma nova aula
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LessonType | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Aula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="group-beginner">Grupo Iniciante</SelectItem>
                <SelectItem value="group-intermediate">Grupo Intermediário</SelectItem>
                <SelectItem value="group-advanced">Grupo Avançado</SelectItem>
                <SelectItem value="open-conversation">Conversação Aberta</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge className={getTypeColor(template.type)}>
                      {getTypeLabel(template.type)}
                    </Badge>
                    <div className="flex items-center gap-1 text-blue-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-bold">{template.creditCost}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.topic}</CardTitle>
                  <CardDescription>
                    {UNIVERSAL_THEMES[template.theme].name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">{template.grammarFocus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{template.duration} min</span>
                      <Users className="w-4 h-4 text-purple-500 ml-2" />
                      <span>{template.maxStudents} alunos</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTemplateSelect(template)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Aula
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Lesson Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Aula</DialogTitle>
            <DialogDescription>
              Baseado no template: {selectedTemplate?.topic} - {selectedTemplate && UNIVERSAL_THEMES[selectedTemplate.theme].name}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-6">
              {/* Template Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Informações do Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Foco Gramatical:</strong> {selectedTemplate.grammarFocus}</div>
                  <div><strong>Duração:</strong> {selectedTemplate.duration} minutos</div>
                  <div><strong>Máximo de Alunos:</strong> {selectedTemplate.maxStudents}</div>
                  <div><strong>Custo:</strong> {selectedTemplate.creditCost} crédito(s)</div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Aula *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Família e Relacionamentos - Nível Básico"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o conteúdo e metodologia da aula..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Objetivos de Aprendizagem *</Label>
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder={`Objetivo ${index + 1}`}
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      />
                      {formData.objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeObjective(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addObjective}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Objetivo
                  </Button>
                </div>

                <div>
                  <Label>Materiais Necessários</Label>
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder={`Material ${index + 1}`}
                        value={material}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                      />
                      {formData.materials.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeMaterial(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Material
                  </Button>
                </div>

                <div>
                  <Label htmlFor="prerequisites">Pré-requisitos</Label>
                  <Input
                    id="prerequisites"
                    placeholder="Ex: Conhecimento básico de verbos regulares"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="datetime">Data e Hora (Opcional)</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Você pode definir a data depois na agenda do Google Calendar
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateLesson}
              disabled={!formData.title || !formData.description || formData.objectives.some(obj => !obj.trim())}
            >
              <Save className="w-4 h-4 mr-2" />
              Criar Aula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherLessons;