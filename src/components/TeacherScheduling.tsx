import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, User, CheckCircle, Loader2, Plus, X, Users, Globe } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { googleCalendarService } from "@/services/google-calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TeacherSchedulingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeacherScheduling = ({ open, onOpenChange }: TeacherSchedulingProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isOpenClass, setIsOpenClass] = useState(false);
  const [maxStudents, setMaxStudents] = useState<string>("6");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [lessonType, setLessonType] = useState<string>("");
  const [lessonTopic, setLessonTopic] = useState<string>("");
  const [lessonNotes, setLessonNotes] = useState<string>("");
  const [duration, setDuration] = useState<string>("45");
  const [isCreating, setIsCreating] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lista de alunos (pode vir do Supabase futuramente)
  const students = [
    { id: "1", name: "Maria Silva", level: "Intermediate", email: "maria.silva@email.com" },
    { id: "2", name: "João Santos", level: "Advanced", email: "joao.santos@email.com" },
    { id: "3", name: "Ana Costa", level: "Intermediate", email: "ana.costa@email.com" },
    { id: "4", name: "Pedro Alves", level: "Beginner", email: "pedro.alves@email.com" },
    { id: "5", name: "Carla Mendes", level: "Intermediate", email: "carla.mendes@email.com" },
    { id: "6", name: "Lucas Ferreira", level: "Advanced", email: "lucas.ferreira@email.com" },
    { id: "7", name: "Juliana Lima", level: "Beginner", email: "juliana.lima@email.com" },
    { id: "8", name: "Roberto Dias", level: "Intermediate", email: "roberto.dias@email.com" },
  ];

  // Horários disponíveis (9h às 20h)
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  // Tipos de aula
  const lessonTypes = [
    { value: "conversation", label: "Conversação", color: "blue" },
    { value: "grammar", label: "Gramática", color: "green" },
    { value: "business", label: "Business English", color: "purple" },
    { value: "ielts", label: "IELTS Preparation", color: "orange" },
    { value: "travel", label: "Travel English", color: "cyan" },
    { value: "general", label: "Aula Geral", color: "gray" },
  ];

  // Inicializa Google Calendar
  useEffect(() => {
    const initCalendar = async () => {
      try {
        const initialized = await googleCalendarService.initialize();
        setCalendarInitialized(initialized);

        if (initialized) {
          // Tenta autenticar
          const authenticated = await googleCalendarService.authenticate();
          setIsAuthenticated(authenticated);

          if (authenticated) {
            // Garante que o calendário "Aulas Inglês Pareto" existe
            await googleCalendarService.ensureParetoCalendarExists();
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar Google Calendar:', error);
        setCalendarInitialized(false);
        setIsAuthenticated(false);
      }
    };

    if (open) {
      initCalendar();
    }
  }, [open]);

  // Função para toggle de seleção de aluno
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // Gera os próximos 14 dias para seleção
  const generateAvailableDates = () => {
    const currentDate = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));
  };

  const availableDates = generateAvailableDates();

  // Calcula células vazias para alinhar calendário
  const getEmptyCellsCount = () => {
    const currentDate = new Date();
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    const daysFromStart = Math.floor((currentDate.getTime() - startOfCurrentWeek.getTime()) / (1000 * 60 * 60 * 24));
    return daysFromStart % 7;
  };

  const handleCreateLesson = async () => {
    // Validações
    if (!isOpenClass && selectedStudents.length === 0) {
      toast({
        title: "⚠️ Selecione pelo menos um aluno",
        description: "Escolha um ou mais alunos para a aula, ou marque como 'Aula Aberta'.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "⚠️ Selecione uma data",
        description: "Escolha a data da aula.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "⚠️ Selecione um horário",
        description: "Escolha o horário da aula.",
        variant: "destructive",
      });
      return;
    }

    if (!lessonType) {
      toast({
        title: "⚠️ Selecione o tipo de aula",
        description: "Escolha o tipo de aula.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const lessonTypeData = lessonTypes.find(lt => lt.value === lessonType);
      if (!lessonTypeData) {
        throw new Error("Tipo de aula inválido");
      }

      // Preparar lista de participantes
      const selectedStudentsList = students.filter(s => selectedStudents.includes(s.id));

      // Adicionar professor como participante (para aparecer no calendário dele)
      const teacherEmail = user?.email || '';
      const teacherName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Professor';

      const attendees = [
        // Professor sempre é incluído
        {
          email: teacherEmail,
          displayName: teacherName,
          organizer: true,
          responseStatus: 'accepted' as const
        },
        // Alunos selecionados
        ...selectedStudentsList.map(s => ({
          email: s.email,
          displayName: s.name
        }))
      ];

      // Criar evento no Google Calendar
      const [hours, minutes] = selectedTime.split(':');
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(startDateTime.getMinutes() + parseInt(duration));

      // Montar título e descrição
      let eventTitle = `Aula de ${lessonTypeData.label}`;
      if (isOpenClass) {
        eventTitle += ` - Aula Aberta (até ${maxStudents} alunos)`;
      } else if (selectedStudentsList.length === 1) {
        eventTitle += ` - ${selectedStudentsList[0].name}`;
      } else {
        eventTitle += ` - Grupo (${selectedStudentsList.length} alunos)`;
      }

      const event = {
        summary: eventTitle,
        description: `
👨‍🏫 Professor: ${teacherName}
📚 Tipo: ${lessonTypeData.label}
📖 Tópico: ${lessonTopic || 'A definir'}
${isOpenClass ? `🌐 Aula Aberta - Máximo ${maxStudents} alunos\n` : ''}
${selectedStudentsList.length > 0 ? `👥 Alunos inscritos: ${selectedStudentsList.map(s => s.name).join(', ')}\n` : ''}

${lessonNotes ? `📝 Observações:\n${lessonNotes}\n` : ''}
🎓 Escola Inglês Pareto
        `.trim(),
        start: startDateTime,
        end: endDateTime,
        attendees: attendees,
        lessonType: lessonType,
      };

      // Tentar criar no Google Calendar
      let calendarSuccess = false;
      let calendarError = null;

      if (calendarInitialized && isAuthenticated) {
        try {
          console.log('🔄 Criando evento no Google Calendar...', event);
          await googleCalendarService.createEvent(event);
          calendarSuccess = true;
          console.log('✅ Evento criado com sucesso no Google Calendar!');
        } catch (calError) {
          console.error('❌ Erro ao criar evento no Google Calendar:', calError);
          calendarError = calError;
        }
      } else {
        console.warn('⚠️ Google Calendar não autenticado. Evento não será criado.');
      }

      // Mensagem de sucesso
      const participantInfo = isOpenClass
        ? `Aula Aberta (até ${maxStudents} alunos)`
        : selectedStudentsList.length === 1
        ? selectedStudentsList[0].name
        : `${selectedStudentsList.length} alunos`;

      toast({
        title: calendarSuccess ? "✅ Aula Agendada no Google Calendar!" : "⚠️ Aula Criada (sem sincronização)",
        description: `Aula de ${lessonTypeData.label} com ${participantInfo} agendada para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}.${calendarSuccess ? ' ✓ Sincronizado com Google Calendar' : ' ⚠️ Google Calendar não conectado'}`,
        duration: 7000,
        variant: calendarSuccess ? "default" : "destructive",
      });

      // Limpar formulário e fechar
      resetForm();
      onOpenChange(false);

    } catch (error) {
      console.error('Erro ao criar aula:', error);
      toast({
        title: "❌ Erro ao Agendar",
        description: "Não foi possível criar a aula. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedStudents([]);
    setIsOpenClass(false);
    setMaxStudents("6");
    setSelectedDate(null);
    setSelectedTime("");
    setLessonType("");
    setLessonTopic("");
    setLessonNotes("");
    setDuration("45");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Nova Aula
          </DialogTitle>
          <DialogDescription>
            Crie um agendamento para seus alunos e sincronize com Google Calendar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status do Google Calendar */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>✅ Conectado ao Google Calendar - Eventos serão criados automaticamente</span>
            </div>
          ) : calendarInitialized ? (
            <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Aguardando autenticação Google Calendar...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <X className="h-4 w-4" />
              <span>⚠️ Google Calendar não configurado - Veja GOOGLE_CALENDAR_SETUP.md</span>
            </div>
          )}

          {/* Aula Aberta Switch */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <Label htmlFor="openClass" className="font-semibold">Aula Aberta</Label>
                <p className="text-xs text-muted-foreground">Permitir que outros alunos participem</p>
              </div>
            </div>
            <Switch
              id="openClass"
              checked={isOpenClass}
              onCheckedChange={setIsOpenClass}
            />
          </div>

          {/* Limite de alunos (se aula aberta) */}
          {isOpenClass && (
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Máximo de Alunos</Label>
              <Select value={maxStudents} onValueChange={setMaxStudents}>
                <SelectTrigger id="maxStudents">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 alunos</SelectItem>
                  <SelectItem value="6">6 alunos</SelectItem>
                  <SelectItem value="8">8 alunos</SelectItem>
                  <SelectItem value="10">10 alunos</SelectItem>
                  <SelectItem value="12">12 alunos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Seleção Múltipla de Alunos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Label>Alunos {!isOpenClass && '*'}</Label>
              {selectedStudents.length > 0 && (
                <Badge variant="secondary">{selectedStudents.length} selecionado(s)</Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
              {students.map((student) => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => toggleStudentSelection(student.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{student.name}</p>
                      <Badge variant="outline" className="text-xs">{student.level}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendário de Datas */}
          <div className="space-y-2">
            <Label>Data da Aula *</Label>
            <div className="grid grid-cols-7 gap-2">
              {/* Dias da semana */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Células vazias para alinhar */}
              {Array.from({ length: getEmptyCellsCount() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}

              {/* Dias disponíveis */}
              {availableDates.map((date) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                return (
                  <Button
                    key={date.toISOString()}
                    variant={isSelected ? "default" : "outline"}
                    className={`h-16 flex flex-col items-center justify-center ${
                      isSelected ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <span className="text-xs">{format(date, 'EEE', { locale: ptBR })}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                    <span className="text-xs">{format(date, 'MMM', { locale: ptBR })}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Horário e Duração */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                  <SelectItem value="90">90 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo de Aula */}
          <div className="space-y-2">
            <Label htmlFor="lessonType">Tipo de Aula *</Label>
            <Select value={lessonType} onValueChange={setLessonType}>
              <SelectTrigger id="lessonType">
                <SelectValue placeholder="Selecione o tipo de aula" />
              </SelectTrigger>
              <SelectContent>
                {lessonTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tópico da Aula */}
          <div className="space-y-2">
            <Label htmlFor="topic">Tópico da Aula (opcional)</Label>
            <Input
              id="topic"
              placeholder="Ex: Present Perfect, Travel Vocabulary, etc."
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Materiais necessários, objetivos da aula, etc."
              value={lessonNotes}
              onChange={(e) => setLessonNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Resumo */}
          {((selectedStudents.length > 0 || isOpenClass) && selectedDate && selectedTime && lessonType) && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  📋 Resumo do Agendamento
                  {isOpenClass && <Badge variant="secondary" className="bg-blue-500 text-white">Aula Aberta</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium">Participantes:</span>
                    {isOpenClass ? (
                      <div className="mt-1">
                        <Badge variant="outline" className="bg-blue-50">
                          🌐 Aula Aberta (até {maxStudents} alunos)
                        </Badge>
                        {selectedStudents.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Inscritos: {students.filter(s => selectedStudents.includes(s.id)).map(s => s.name).join(', ')}
                          </p>
                        )}
                      </div>
                    ) : selectedStudents.length === 1 ? (
                      <span className="ml-1">{students.find(s => s.id === selectedStudents[0])?.name}</span>
                    ) : (
                      <div className="mt-1">
                        <Badge variant="outline">Grupo de {selectedStudents.length} alunos</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {students.filter(s => selectedStudents.includes(s.id)).map(s => s.name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Data:</span>
                  <span>{format(selectedDate, "dd/MM/yyyy (EEEE)", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Horário:</span>
                  <span>{selectedTime} ({duration} minutos)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Tipo:</span>
                  <span>{lessonTypes.find(lt => lt.value === lessonType)?.label}</span>
                </div>
                {lessonTopic && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Tópico:</span>
                    <span>{lessonTopic}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleCreateLesson}
            disabled={isCreating || (!isOpenClass && selectedStudents.length === 0) || !selectedDate || !selectedTime || !lessonType}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherScheduling;
