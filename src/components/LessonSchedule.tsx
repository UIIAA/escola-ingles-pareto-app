import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LessonSchedule = () => {
  // Dados simulados para aulas agendadas
  const upcomingLessons = [
    { id: "1", student: "João Silva", date: new Date(), time: "10:30", duration: 45, teacher: "Ana Silva" },
    { id: "2", student: "Maria Oliveira", date: new Date(Date.now() + 86400000), time: "14:00", duration: 60, teacher: "Carlos Oliveira" },
    { id: "3", student: "Pedro Costa", date: new Date(Date.now() + 172800000), time: "09:00", duration: 60, teacher: "Mariana Costa" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Próximas Aulas
        </CardTitle>
        <CardDescription>
          Visualize suas aulas agendadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingLessons.length > 0 ? (
            upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <p className="font-medium">{lesson.student}</p>
                  <Badge variant="secondary">{lesson.duration} min</Badge>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-2">{lesson.teacher}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(lesson.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lesson.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma aula agendada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonSchedule;