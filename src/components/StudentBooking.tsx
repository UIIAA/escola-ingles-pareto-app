import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, Loader2 } from "lucide-react";
import { format, addDays, startOfWeek, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { googleCalendarService } from "@/services/google-calendar";

const StudentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Array<{
    id: string;
    time: string;
    duration: number;
    teacherId: string;
    available: boolean;
  }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);

  // Dados simulados para professores
  const teachers = [
    { id: "1", name: "Ana Silva", specialty: "Conversação", avatar: "" },
    { id: "2", name: "Carlos Oliveira", specialty: "Gramática", avatar: "" },
    { id: "3", name: "Mariana Costa", specialty: "Negócios", avatar: "" },
  ];

  // Inicializa o Google Calendar Service
  useEffect(() => {
    const initCalendar = async () => {
      try {
        const initialized = await googleCalendarService.initialize();
        setCalendarInitialized(initialized);
        if (initialized) {
          console.log('✅ Google Calendar Service inicializado');
        } else {
          console.warn('⚠️ Google Calendar Service não inicializado - usando mock');
        }
      } catch (error) {
        console.error('Erro ao inicializar Google Calendar:', error);
        setCalendarInitialized(false);
      }
    };

    initCalendar();
  }, []);

  // Busca horários disponíveis quando uma data é selecionada
  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    setAvailableSlots([]);

    try {
      // Busca disponibilidade real do Google Calendar
      const slots = await googleCalendarService.getAvailableTimeSlots(date);

      // Converte para formato compatível com o componente
      const formattedSlots = slots.map((slot, index) => ({
        id: (index + 1).toString(),
        time: slot.time,
        duration: 60, // duração padrão
        teacherId: slot.available ? "1" : "ocupado", // professor disponível ou ocupado
        available: slot.available
      }));

      setAvailableSlots(formattedSlots);
      console.log(`📅 Carregados ${formattedSlots.length} horários para ${date.toDateString()}`);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      // Fallback para horários mockados em caso de erro
      setAvailableSlots([
        { id: "1", time: "09:00", duration: 60, teacherId: "1", available: true },
        { id: "2", time: "14:00", duration: 60, teacherId: "2", available: false },
        { id: "3", time: "15:30", duration: 60, teacherId: "1", available: true },
      ]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Dados simulados para dias do calendário
  const currentDate = new Date();
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // Domingo = 0
  const days = Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));

  // Calcular células vazias no início para alinhar com dia da semana
  const firstDayOfWeek = startOfCurrentWeek;
  const daysFromStart = Math.floor((currentDate.getTime() - firstDayOfWeek.getTime()) / (1000 * 60 * 60 * 24));
  const emptyCellsCount = daysFromStart % 7;

  const getTeacherById = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  const handleBookLesson = () => {
    if (selectedSlot) {
      const slot = availableSlots.find(s => s.id === selectedSlot);
      alert(`Aula agendada para ${selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ''} às ${slot?.time}`);
      setSelectedSlot(null);
      // Recarrega horários após agendamento
      if (selectedDate) {
        loadAvailableSlots(selectedDate);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Agendar Aula
        </CardTitle>
        <CardDescription>
          Escolha uma data e horário para sua próxima aula
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {/* Células vazias para alinhar com dia da semana correto */}
          {Array.from({ length: emptyCellsCount }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16" />
          ))}
          {days.map((day) => (
            <Button
              key={day.toString()}
              variant={selectedDate && isSameDay(day, selectedDate) ? "default" : "outline"}
              className={`h-16 flex flex-col ${!isSameMonth(day, currentDate) ? "text-muted-foreground" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              <span className="text-sm">{format(day, "d")}</span>
              <span className="text-xs">{format(day, "MMM", { locale: ptBR })}</span>
            </Button>
          ))}
        </div>

        {selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h3>
              {!calendarInitialized && (
                <Badge variant="outline" className="text-xs">
                  Modo Mock
                </Badge>
              )}
            </div>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Verificando disponibilidade no calendário...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSlots.map((slot) => {
                  const teacher = getTeacherById(slot.teacherId);
                  return (
                    <Card
                      key={slot.id}
                      className={`cursor-pointer transition-all ${selectedSlot === slot.id ? "border-primary" : ""} ${!slot.available ? "opacity-50" : ""}`}
                      onClick={() => slot.available && setSelectedSlot(slot.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="font-medium">{slot.time}</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{slot.duration} min</span>
                            </div>
                            {teacher && (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{teacher.name}</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {teacher.specialty}
                                </Badge>
                              </div>
                            )}
                          </div>
                          {selectedSlot === slot.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                          {!slot.available && (
                            <Badge variant="destructive">Ocupado</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Confirmar Agendamento</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">
                      {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ''} às{" "}
                      {availableSlots.find(s => s.id === selectedSlot)?.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Professor: {getTeacherById(availableSlots.find(s => s.id === selectedSlot)?.teacherId || "")?.name}
                    </p>
                  </div>
                  <Button onClick={handleBookLesson}>
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentBooking;