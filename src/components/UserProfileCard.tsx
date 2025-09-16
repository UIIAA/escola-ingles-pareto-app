import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Globe } from "lucide-react";

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'master';
    phone?: string;
    timezone?: string;
    bio?: string;
    specialty?: string;
  };
  onEdit?: () => void;
}

const UserProfileCard = ({ user, onEdit }: UserProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Visualize e edite suas informações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <Badge className="mt-2">
            {user.role === 'student' && 'Aluno'}
            {user.role === 'teacher' && 'Professor'}
            {user.role === 'master' && 'Administrador'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </div>
            <p className="font-medium">{user.email}</p>
          </div>
          
          {user.phone && (
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Phone className="h-4 w-4 mr-2" />
                Telefone
              </div>
              <p className="font-medium">{user.phone}</p>
            </div>
          )}
          
          {user.timezone && (
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Globe className="h-4 w-4 mr-2" />
                Fuso Horário
              </div>
              <p className="font-medium">{user.timezone}</p>
            </div>
          )}
          
          {user.role === 'teacher' && user.specialty && (
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                Especialidade
              </div>
              <p className="font-medium">{user.specialty}</p>
            </div>
          )}
          
          {user.bio && (
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4 mr-2" />
                Biografia
              </div>
              <p className="font-medium">{user.bio}</p>
            </div>
          )}
        </div>
        
        {onEdit && (
          <Button className="w-full mt-6" onClick={onEdit}>
            Editar Perfil
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;