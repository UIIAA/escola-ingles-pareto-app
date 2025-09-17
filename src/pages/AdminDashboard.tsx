import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  BookOpen,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Settings,
  UserPlus,
  CreditCard,
  MessageSquare,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalUsers: 156,
    newUsersThisMonth: 24,
    totalStudents: 128,
    totalTeachers: 8,
    monthlyRevenue: 45680,
    revenueGrowth: 18.5,
    totalLessons: 1247,
    completedLessons: 1189,
    averageRating: 4.7,
    systemUptime: 99.8
  });

  const userData = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Administrador',
    email: user.email || ''
  } : null;

  const recentActivities = [
    {
      type: 'user_signup',
      message: 'Novo aluno cadastrado: Ana Silva',
      time: '2 minutos atrás',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      type: 'lesson_completed',
      message: 'Aula concluída: Business English (Prof. João)',
      time: '15 minutos atrás',
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      type: 'payment_received',
      message: 'Pagamento recebido: R$ 180 (Maria Santos)',
      time: '1 hora atrás',
      icon: CreditCard,
      color: 'text-emerald-600'
    },
    {
      type: 'teacher_joined',
      message: 'Novo professor: Prof. Carlos Silva',
      time: '3 horas atrás',
      icon: UserPlus,
      color: 'text-purple-600'
    },
    {
      type: 'forum_post',
      message: '5 novas perguntas no fórum',
      time: '6 horas atrás',
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'Backup automático falhou ontem às 03:00',
      action: 'Verificar logs',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      type: 'info',
      message: 'Atualização do sistema agendada para domingo',
      action: 'Ver detalhes',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      type: 'success',
      message: 'Todas as integrações funcionando normalmente',
      action: 'Monitorar',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const topTeachers = [
    {
      name: 'Prof. Ana Silva',
      students: 24,
      rating: 4.9,
      earnings: 'R$ 5.480',
      hours: 48
    },
    {
      name: 'Prof. João Santos',
      students: 18,
      rating: 4.8,
      earnings: 'R$ 4.320',
      hours: 36
    },
    {
      name: 'Prof. Maria Costa',
      students: 22,
      rating: 4.7,
      earnings: 'R$ 4.180',
      hours: 44
    }
  ];

  const financialData = [
    { month: 'Jan', revenue: 32400, students: 98, lessons: 856 },
    { month: 'Fev', revenue: 35680, students: 112, lessons: 924 },
    { month: 'Mar', revenue: 39240, students: 128, lessons: 1089 },
    { month: 'Abr', revenue: 42150, students: 134, lessons: 1156 },
    { month: 'Mai', revenue: 45680, students: 156, lessons: 1247 }
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Adicionar, editar ou remover usuários',
      action: () => navigate('/admin/users'),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Relatórios Financeiros',
      description: 'Visualizar receitas e pagamentos',
      action: () => navigate('/admin/finance'),
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Analytics',
      description: 'Métricas e estatísticas detalhadas',
      action: () => navigate('/admin/analytics'),
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      title: 'Configurações',
      description: 'Configurar sistema e integrações',
      action: () => navigate('/admin/settings'),
      icon: Settings,
      color: 'bg-gray-500'
    }
  ];

  if (!userData) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header do administrador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Painel Administrativo 🎛️
          </h1>
          <p className="text-muted-foreground">Olá, {userData.name}! Gerencie toda a plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
          <Button onClick={() => navigate('/admin/settings')} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{analytics.newUsersThisMonth} este mês</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {analytics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics.revenueGrowth}% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas do Mês</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics.totalLessons}</div>
            <p className="text-xs text-muted-foreground">{analytics.completedLessons} completas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">Satisfação geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas do sistema */}
      {systemAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <alert.icon className={`h-5 w-5 ${alert.color}`} />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button variant="outline" size="sm">
                  {alert.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade recente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="link" className="p-0 text-blue-600">
              Ver todas as atividades →
            </Button>
          </CardContent>
        </Card>

        {/* Top professores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Top Professores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTeachers.map((teacher, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{teacher.name}</h4>
                  <Badge variant="outline" className="text-xs">⭐ {teacher.rating}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>{teacher.students} alunos</span>
                  <span>{teacher.earnings}</span>
                  <span>{teacher.hours}h de aula</span>
                  <span>#{index + 1} ranking</span>
                </div>
              </div>
            ))}
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => navigate('/admin/teachers')}
            >
              Ver todos os professores
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics Detalhado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Crescimento de Usuários</h4>
                  <div className="text-2xl font-bold text-blue-600">+{analytics.revenueGrowth}%</div>
                  <Progress value={analytics.revenueGrowth * 4} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Taxa de Conclusão</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((analytics.completedLessons / analytics.totalLessons) * 100)}%
                  </div>
                  <Progress value={(analytics.completedLessons / analytics.totalLessons) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Uptime do Sistema</h4>
                  <div className="text-2xl font-bold text-purple-600">{analytics.systemUptime}%</div>
                  <Progress value={analytics.systemUptime} className="h-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="space-y-4">
                <h4 className="font-medium">Evolução Financeira (Últimos 5 meses)</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {financialData.map((data, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">{data.month}</div>
                      <div className="text-lg font-bold text-green-600">R$ {data.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{data.students} alunos</div>
                      <div className="text-xs text-muted-foreground">{data.lessons} aulas</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Distribuição de Usuários</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Alunos</span>
                      <span className="font-medium">{analytics.totalStudents} ({Math.round((analytics.totalStudents / analytics.totalUsers) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.totalStudents / analytics.totalUsers) * 100} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span>Professores</span>
                      <span className="font-medium">{analytics.totalTeachers} ({Math.round((analytics.totalTeachers / analytics.totalUsers) * 100)}%)</span>
                    </div>
                    <Progress value={(analytics.totalTeachers / analytics.totalUsers) * 100} className="h-2" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Métricas de Engajamento</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Usuários ativos diários</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Usuários ativos semanais</span>
                      <span className="font-medium">134</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Taxa de retenção (30 dias)</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Performance do Sistema</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Tempo de resposta médio</span>
                      <span className="font-medium text-green-600">245ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Uptime mensal</span>
                      <span className="font-medium text-green-600">{analytics.systemUptime}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Erros por hora</span>
                      <span className="font-medium text-yellow-600">0.3</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Qualidade do Serviço</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Avaliação média das aulas</span>
                      <span className="font-medium text-yellow-600">{analytics.averageRating}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxa de cancelamento</span>
                      <span className="font-medium text-green-600">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Satisfação do cliente</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Administrativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={action.action}
              >
                <div className={`p-4 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;