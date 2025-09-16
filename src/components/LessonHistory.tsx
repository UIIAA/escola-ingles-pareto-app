import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lesson {
  id: string;
  student?: string;
  teacher?: string;
  date: Date;
  time: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'missed';
}

interface LessonHistoryProps {
  lessons: Lesson[];
  userType: 'student' | 'teacher';
}

const LessonHistory = ({ lessons, userType }: LessonHistoryProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      case 'missed':
        return <Badge variant="outline">Faltou</Badge>;
      default:
        return <Badge variant="secondary">Agendada</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Histórico de Aulas
        </CardTitle>
        <CardDescription>
          Visualize suas aulas passadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {userType === 'student' ? lesson.teacher : lesson.student}
                  </p>
                  {getStatusBadge(lesson.status)}
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(lesson.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{lesson.time}</span>
                  <span className="mx-2">•</span>
                  <span>{lesson.duration} min</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma aula no histórico
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonHistory;