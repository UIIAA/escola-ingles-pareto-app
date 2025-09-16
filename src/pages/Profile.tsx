import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Globe, Save, Camera } from "lucide-react";
import UserProfileCard from "@/components/UserProfileCard";
import NotificationSettings from "@/components/NotificationSettings";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Nome do Usuário",
    email: "usuario@exemplo.com",
    role: "student",
    phone: "(11) 99999-9999",
    timezone: "America/Sao_Paulo",
    bio: "Professor de inglês com 5 anos de experiência. Especializado em conversação e preparação para exames internacionais.",
  });

  const handleSave = () => {
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfileCard 
            user={{
              name: user.name,
              email: user.email,
              role: user.role as "student" | "teacher" | "master",
              phone: user.phone,
              timezone: user.timezone,
              bio: user.bio,
              specialty: user.role === "teacher" ? "Conversação e exames" : undefined
            }} 
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={user.name} 
                      onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user.email} 
                      onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      value={user.phone} 
                      onChange={(e) => setUser({...user, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select 
                      value={user.timezone} 
                      onValueChange={(value) => setUser({...user, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">Nova York (GMT-4)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {user.role === 'teacher' && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea 
                      id="bio" 
                      rows={4} 
                      value={user.bio} 
                      onChange={(e) => setUser({...user, bio: e.target.value})}
                      placeholder="Conte sobre sua experiência e especialidades como professor..."
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <NotificationSettings />
        </div>
      </div>
    </div>
  );
};

export default Profile;