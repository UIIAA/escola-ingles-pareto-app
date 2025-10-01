import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, CheckCircle, Loader2, Plus, X } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { googleCalendarService } from "@/services/google-calendar";
import { useToast } from "@/hooks/use-toast";

interface TeacherSchedulingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeacherScheduling = ({ open, onOpenChange }: TeacherSchedulingProps) => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [lessonType, setLessonType] = useState<string>("");
  const [lessonTopic, setLessonTopic] = useState<string>("");
  const [lessonNotes, setLessonNotes] = useState<string>("");
  const [duration, setDuration] = useState<string>("45");
  const [isCreating, setIsCreating] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);

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
      } catch (error) {
        console.error('Erro ao inicializar Google Calendar:', error);
        setCalendarInitialized(false);
      }
    };

    if (open) {
      initCalendar();
    }
  }, [open]);

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
    if (!selectedStudent) {
      toast({
        title: "⚠️ Selecione um aluno",
        description: "Escolha o aluno para agendar a aula.",
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
      const student = students.find(s => s.id === selectedStudent);
      const lessonTypeData = lessonTypes.find(lt => lt.value === lessonType);

      if (!student || !lessonTypeData) {
        throw new Error("Dados inválidos");
      }

      // Criar evento no Google Calendar
      const [hours, minutes] = selectedTime.split(':');
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(startDateTime.getMinutes() + parseInt(duration));

      const event = {
        summary: `Aula de ${lessonTypeData.label} - ${student.name}`,
        description: `
Tipo: ${lessonTypeData.label}
Tópico: ${lessonTopic || 'A definir'}
Nível: ${student.level}

${lessonNotes ? `Observações:\n${lessonNotes}` : ''}

🎓 Escola Inglês Pareto
        `.trim(),
        start: startDateTime,
        end: endDateTime,
        attendees: [
          { email: student.email, displayName: student.name }
        ],
        lessonType: lessonType,
      };

      // Tentar criar no Google Calendar
      let calendarSuccess = false;
      if (calendarInitialized) {
        try {
          await googleCalendarService.createEvent(event);
          calendarSuccess = true;
        } catch (calError) {
          console.error('Erro ao criar evento no Google Calendar:', calError);
        }
      }

      // Sucesso
      toast({
        title: "✅ Aula Agendada!",
        description: `Aula de ${lessonTypeData.label} com ${student.name} agendada para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${selectedTime}.${calendarSuccess ? ' Evento criado no Google Calendar.' : ''}`,
        duration: 5000,
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
    setSelectedStudent("");
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
          {/* Seleção de Aluno */}
          <div className="space-y-2">
            <Label htmlFor="student">Aluno *</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Selecione o aluno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{student.name}</span>
                      <Badge variant="outline" className="ml-2">{student.level}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Status do Google Calendar */}
          {calendarInitialized && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>Conectado ao Google Calendar - O evento será criado automaticamente</span>
            </div>
          )}

          {/* Resumo */}
          {selectedStudent && selectedDate && selectedTime && lessonType && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Aluno:</span>
                  <span>{students.find(s => s.id === selectedStudent)?.name}</span>
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
            disabled={isCreating || !selectedStudent || !selectedDate || !selectedTime || !lessonType}
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
