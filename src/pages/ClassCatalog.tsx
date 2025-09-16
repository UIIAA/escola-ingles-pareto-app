import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  BookOpen,
  Users,
  Clock,
  CreditCard,
  Search,
  Filter,
  Star,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  Calendar
} from 'lucide-react';

import {
  ALL_LESSON_TEMPLATES,
  getTemplatesByType,
  getTemplatesByDifficulty,
  TEMPLATE_STATS
} from '../data/lesson-templates';
import {
  LessonTemplate,
  LessonType,
  DifficultyLevel,
  UniversalTheme,
  UNIVERSAL_THEMES
} from '../types/lesson-templates';

const ClassCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LessonType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedTheme, setSelectedTheme] = useState<UniversalTheme | 'all'>('all');

  // Filtrar templates baseado nos filtros selecionados
  const filteredTemplates = useMemo(() => {
    let templates = ALL_LESSON_TEMPLATES;

    // Filtro por busca
    if (searchQuery.trim()) {
      templates = templates.filter(template =>
        template.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.grammarFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        UNIVERSAL_THEMES[template.theme].name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por tipo
    if (selectedType !== 'all') {
      templates = templates.filter(template => template.type === selectedType);
    }

    // Filtro por dificuldade
    if (selectedDifficulty !== 'all') {
      templates = templates.filter(template => template.difficulty === selectedDifficulty);
    }

    // Filtro por tema
    if (selectedTheme !== 'all') {
      templates = templates.filter(template => template.theme === selectedTheme);
    }

    return templates;
  }, [searchQuery, selectedType, selectedDifficulty, selectedTheme]);

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

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case 'basic': return 'bg-emerald-100 text-emerald-700';
      case 'intermediate': return 'bg-amber-100 text-amber-700';
      case 'advanced': return 'bg-red-100 text-red-700';
    }
  };

  const handleBookLesson = async (template: LessonTemplate) => {
    try {
      // Import services dynamically
      const { useCredits } = await import('@/hooks/useCredits');
      const { googleCalendarService } = await import('@/services/google-calendar');

      console.log('Iniciando agendamento de aula:', template);

      // Check if user has enough credits
      const creditsNeeded = template.creditCost;

      // Simulate checking credits (in real app, this would use the hook)
      const userCredits = 33; // Mock value

      if (userCredits < creditsNeeded) {
        alert(`Créditos insuficientes!\nVocê precisa de ${creditsNeeded} crédito(s) mas tem apenas ${userCredits}.\n\nVisite a página de Créditos para comprar mais.`);
        return;
      }

      // Create calendar event
      const lessonData = {
        lessonId: `lesson_${Date.now()}`,
        templateId: template.id,
        teacherEmail: 'professor@paretoingles.com',
        teacherName: 'Professor Pareto',
        studentEmails: ['aluno@example.com'], // Mock student email
        lessonType: template.type,
        topic: template.topic,
        duration: template.duration,
        creditsCost: template.creditCost
      };

      // Set lesson for tomorrow at 2 PM as example
      const lessonDateTime = new Date();
      lessonDateTime.setDate(lessonDateTime.getDate() + 1);
      lessonDateTime.setHours(14, 0, 0, 0);

      const calendarEvent = await googleCalendarService.createLessonEvent(lessonData, lessonDateTime);

      if (calendarEvent) {
        alert(`✅ Aula agendada com sucesso!\n\n📚 Tópico: ${template.topic}\n📅 Data: ${lessonDateTime.toLocaleDateString('pt-BR')}\n⏰ Horário: ${lessonDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}\n💳 Créditos utilizados: ${template.creditCost}\n\n🗓️ A aula foi adicionada ao calendário "Aulas Inglês Pareto"`);

        // In a real app, here we would:
        // 1. Deduct credits from user account
        // 2. Save lesson to database
        // 3. Send confirmation email
        // 4. Redirect to schedule page
      } else {
        alert('❌ Erro ao agendar aula no calendário. Tente novamente.');
      }

    } catch (error) {
      console.error('Erro ao agendar aula:', error);
      alert('❌ Erro interno ao agendar aula. Tente novamente.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Aulas</h1>
        <p className="text-gray-600 mt-2">
          Explore nossos templates de aulas pré-definidas e agende suas sessões de aprendizado
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{TEMPLATE_STATS.total}</div>
            <div className="text-sm text-gray-600">Total de Templates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{TEMPLATE_STATS.byType['group-beginner']}</div>
            <div className="text-sm text-gray-600">Iniciante</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{TEMPLATE_STATS.byType['group-intermediate']}</div>
            <div className="text-sm text-gray-600">Intermediário</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{TEMPLATE_STATS.byType['group-advanced']}</div>
            <div className="text-sm text-gray-600">Avançado</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{TEMPLATE_STATS.byType['open-conversation']}</div>
            <div className="text-sm text-gray-600">Conversação</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por tópico, gramática ou tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as LessonType | 'all')}>
              <SelectTrigger>
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

            <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as DifficultyLevel | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Nível de Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTheme} onValueChange={(value) => setSelectedTheme(value as UniversalTheme | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Tema Universal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Temas</SelectItem>
                {Object.entries(UNIVERSAL_THEMES).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template encontrado' : 'templates encontrados'}
          </h2>
          {(selectedType !== 'all' || selectedDifficulty !== 'all' || selectedTheme !== 'all' || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedDifficulty('all');
                setSelectedTheme('all');
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge className={getTypeColor(template.type)}>
                      {getTypeLabel(template.type)}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-bold">{template.creditCost}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.creditCost === 1 ? 'crédito' : 'créditos'}
                    </div>
                  </div>
                </div>

                <CardTitle className="text-lg">{template.topic}</CardTitle>
                <CardDescription>
                  {UNIVERSAL_THEMES[template.theme].name}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Grammar Focus */}
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Foco Gramatical:</span>
                  <span className="text-gray-600">{template.grammarFocus}</span>
                </div>

                {/* Duration and Students */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{template.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Até {template.maxStudents} {template.maxStudents === 1 ? 'aluno' : 'alunos'}</span>
                  </div>
                </div>

                {/* Suggested Activities Preview */}
                {template.templateInfo.suggestedActivities.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Atividades Sugeridas:</div>
                    <div className="text-xs text-gray-600">
                      {template.templateInfo.suggestedActivities.slice(0, 2).join(', ')}
                      {template.templateInfo.suggestedActivities.length > 2 && '...'}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleBookLesson(template)}
                    className="flex-1"
                    size="sm"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Agendar Aula
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Show template details modal
                      alert(`Detalhes do template: ${template.topic}`);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedDifficulty('all');
                  setSelectedTheme('all');
                }}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClassCatalog;