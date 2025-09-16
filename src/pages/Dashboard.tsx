import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, Clock, CreditCard, Users, BookOpen, Bell, User, Settings } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: 'user_123',
    email: 'usuario@exemplo.com',
    role: 'student', // Pode ser 'student', 'teacher' ou 'master'
    name: 'Nome do Usuário',
    created_at: new Date().toISOString()
  });
  
  const [credits, setCredits] = useState(8);
  const [hasLowCredits, setHasLowCredits] = useState(false);

  // Simular verificação de créditos baixos
  useEffect(() => {
    setHasLowCredits(credits <= 2);
  }, [credits]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo, {user.name}</h1>
          <p className="text-muted-foreground">Dashboard do sistema de aulas de inglês</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {user.role === 'student' && 'Aluno'}
            {user.role === 'teacher' && 'Professor'}
            {user.role === 'master' && 'Administrador'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        </div>
      </div>

      {/* Alerta para alunos com créditos baixos */}
      {user.role === 'student' && hasLowCredits && (
        <Alert variant="warning" className="mb-6">
          <Bell className="h-4 w-4" />
          <AlertTitle>Créditos Baixos</AlertTitle>
          <AlertDescription>
            Você tem apenas {credits} créditos restantes. Considere comprar mais créditos para continuar agendando aulas.
            <Button 
              variant="link" 
              className="px-0 ml-2"
              onClick={() => navigate('/credits')}
            >
              Comprar créditos
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de métricas - diferentes por perfil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.role === 'student' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Créditos Disponíveis</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{credits}</div>
                <p className="text-xs text-muted-foreground">Aulas disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Aulas</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Agendadas</p>
              </CardContent>
            </Card>
          </>
        )}

        {(user.role === 'teacher' || user.role === 'master') && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aulas Agendadas</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'master' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 12.450</div>
                <p className="text-xs text-muted-foreground">+18% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Participadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {user.role === 'student' ? 'Próximas Aulas' : 'Minhas Aulas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Aula de Inglês com Ana Silva</p>
                  <p className="text-sm text-muted-foreground">
                    Hoje, 10:30 - 11:15
                  </p>
                </div>
                <Badge variant="secondary">Confirmada</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Aula de Inglês com Carlos Oliveira</p>
                  <p className="text-sm text-muted-foreground">
                    Amanhã, 14:00 - 15:00
                  </p>
                </div>
                <Badge variant="secondary">Confirmada</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Aula de Inglês com Mariana Costa</p>
                  <p className="text-sm text-muted-foreground">
                    25/12/2023, 09:00 - 10:00
                  </p>
                </div>
                <Badge variant="secondary">Confirmada</Badge>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => {
                if (user.role === 'student') {
                  navigate('/schedule');
                } else if (user.role === 'teacher') {
                  navigate('/teaching');
                } else {
                  navigate('/admin');
                }
              }}
            >
              {user.role === 'student' && 'Ver todas as aulas'}
              {user.role === 'teacher' && 'Gerenciar disponibilidade'}
              {user.role === 'master' && 'Ver relatórios'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.role === 'student' && (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/schedule')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Nova Aula
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/credits')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Comprar Créditos
                </Button>
              </>
            )}
            
            {user.role === 'teacher' && (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/teaching')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerenciar Disponibilidade
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </Button>
              </>
            )}
            
            {user.role === 'master' && (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Painel de Administração
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </Button>
              </>
            )}
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/profile')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações do Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;