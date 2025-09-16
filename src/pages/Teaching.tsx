import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TeacherAvailability from "@/components/TeacherAvailability";
import LessonSchedule from "@/components/LessonSchedule";
import CalendarIntegration from "@/components/CalendarIntegration";

const Teaching = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Aulas</h1>
          <p className="text-muted-foreground">
            Gerencie sua disponibilidade e visualize suas aulas agendadas
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TeacherAvailability />
        </div>

        <div className="space-y-6">
          <LessonSchedule />
          <CalendarIntegration />
        </div>
      </div>
    </div>
  );
};

export default Teaching;