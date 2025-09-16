import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Edit, Trash } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const TeacherAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Dados simulados para slots de disponibilidade
  const [availabilitySlots, setAvailabilitySlots] = useState([
    { id: "1", date: new Date(), time: "09:00", duration: 60, booked: false },
    { id: "2", date: new Date(), time: "10:30", duration: 45, booked: true },
    { id: "3", date: addDays(new Date(), 1), time: "14:00", duration: 60, booked: false },
    { id: "4", date: addDays(new Date(), 2), time: "11:00", duration: 30, booked: false },
  ]);

  // Dados simulados para dias do calendário
  const currentDate = new Date();
  const days = Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));

  const handleAddAvailability = () => {
    alert("Abrir modal para adicionar disponibilidade");
  };

  const handleEditSlot = (id: string) => {
    alert(`Editar slot ${id}`);
  };

  const handleDeleteSlot = (id: string) => {
    alert(`Excluir slot ${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Minha Disponibilidade
        </CardTitle>
        <CardDescription>
          Gerencie seus horários disponíveis para aulas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {days.map((day) => (
            <Button
              key={day.toString()}
              variant={selectedDate && isSameDay(day, selectedDate) ? "default" : "outline"}
              className={`h-16 flex flex-col ${isSameDay(day, new Date()) ? "border-2 border-primary" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              <span className="text-sm">{format(day, "d")}</span>
              <span className="text-xs">{format(day, "MMM", { locale: ptBR })}</span>
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            {selectedDate 
              ? `Disponibilidade para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}` 
              : "Selecione uma data"}
          </h3>
          <Button onClick={handleAddAvailability} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {selectedDate && (
          <div className="space-y-3">
            {availabilitySlots
              .filter(slot => isSameDay(new Date(slot.date), selectedDate))
              .map((slot) => (
                <Card key={slot.id} className={slot.booked ? "border-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{slot.time}</span>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{slot.duration} min</span>
                        {slot.booked && (
                          <>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <Badge variant="secondary">Agendada</Badge>
                          </>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditSlot(slot.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!slot.booked && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {availabilitySlots.filter(slot => isSameDay(new Date(slot.date), selectedDate)).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma disponibilidade cadastrada para esta data
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherAvailability;