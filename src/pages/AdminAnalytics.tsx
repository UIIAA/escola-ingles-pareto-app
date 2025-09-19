import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Star,
  Target,
  Activity,
  Calendar,
  Eye,
  MousePointer
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('30d');

  // Dados expandidos do AdminDashboard
  const analytics = {
    totalUsers: 156,
    newUsersThisMonth: 24,
    totalStudents: 128,
    totalTeachers: 8,
    monthlyRevenue: 45680,
    revenueGrowth: 18.5,
    totalLessons: 1247,
    completedLessons: 1189,
    averageRating: 4.7,
    systemUptime: 99.8,
    activeUsersDaily: 89,
    activeUsersWeekly: 134,
    retentionRate30d: 78,
    averageSessionTime: 42,
    bounceRate: 23.5,
    conversionRate: 12.8
  };

  // Dados de crescimento mensal
  const growthData = [
    { month: 'Jan', users: 98, revenue: 32400, lessons: 856, retention: 72 },
    { month: 'Fev', users: 112, revenue: 35680, lessons: 924, retention: 74 },
    { month: 'Mar', users: 128, revenue: 39240, lessons: 1089, retention: 76 },
    { month: 'Abr', users: 134, revenue: 42150, lessons: 1156, retention: 77 },
    { month: 'Mai', users: 156, revenue: 45680, lessons: 1247, retention: 78 }
  ];

  // Top páginas
  const topPages = [
    { page: '/dashboard', views: 12450, uniqueVisitors: 8932, avgTime: '4:32' },
    { page: '/schedule', views: 8920, uniqueVisitors: 6234, avgTime: '3:18' },
    { page: '/learning', views: 7850, uniqueVisitors: 5421, avgTime: '6:45' },
    { page: '/forum', views: 5680, uniqueVisitors: 3890, avgTime: '5:12' },
    { page: '/ai-chat', views: 4320, uniqueVisitors: 2987, avgTime: '8:23' }
  ];

  // Dados de engajamento por horário
  const hourlyEngagement = [
    { hour: '6h', users: 12 },
    { hour: '8h', users: 45 },
    { hour: '10h', users: 78 },
    { hour: '12h', users: 89 },
    { hour: '14h', users: 92 },
    { hour: '16h', users: 87 },
    { hour: '18h', users: 95 },
    { hour: '20h', users: 78 },
    { hour: '22h', users: 34 }
  ];

  // Dispositivos
  const deviceStats = [
    { device: 'Desktop', percentage: 45, users: 70 },
    { device: 'Mobile', percentage: 35, users: 55 },
    { device: 'Tablet', percentage: 20, users: 31 }
  ];

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  return (
    <AdminPageLayout
      title="Analytics Detalhado"
      description="Métricas avançadas e análises detalhadas da plataforma"
    >
      {/* Métricas Principais Expandidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos (Hoje)</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.activeUsersDaily}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getTrendIcon(5.2)}
              <span className="ml-1">+5.2% vs ontem</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getTrendIcon(2.1)}
              <span className="ml-1">+2.1% vs mês anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Sessão</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics.averageSessionTime}min</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {getTrendIcon(8.5)}
              <span className="ml-1">+8.5% vs semana anterior</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.retentionRate30d}%</div>
            <p className="text-xs text-muted-foreground">
              30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
          </TabsList>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crescimento Mensal */}
            <Card>
              <CardHeader>
                <CardTitle>Crescimento Mensal</CardTitle>
                <CardDescription>Evolução dos principais indicadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{data.month}</span>
                        <div className="text-right text-xs">
                          <div>{data.users} usuários</div>
                          <div className="text-muted-foreground">R$ {data.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <Progress
                        value={(data.users / 160) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição por Dispositivo */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Dispositivo</CardTitle>
                <CardDescription>Acesso por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceStats.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{device.device}</span>
                        <div className="text-right">
                          <span className="text-sm font-medium">{device.percentage}%</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({device.users} usuários)
                          </span>
                        </div>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Usuários</CardTitle>
                <CardDescription>Por tipo e status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Alunos Ativos</span>
                  <span className="font-medium">{analytics.totalStudents} ({Math.round((analytics.totalStudents / analytics.totalUsers) * 100)}%)</span>
                </div>
                <Progress value={(analytics.totalStudents / analytics.totalUsers) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Professores</span>
                  <span className="font-medium">{analytics.totalTeachers} ({Math.round((analytics.totalTeachers / analytics.totalUsers) * 100)}%)</span>
                </div>
                <Progress value={(analytics.totalTeachers / analytics.totalUsers) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span>Novos este mês</span>
                  <span className="font-medium">{analytics.newUsersThisMonth} usuários</span>
                </div>
              </CardContent>
            </Card>

            {/* Engajamento por Horário */}
            <Card>
              <CardHeader>
                <CardTitle>Picos de Atividade</CardTitle>
                <CardDescription>Usuários ativos por horário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyEngagement.map((data, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm w-8">{data.hour}</span>
                      <div className="flex-1">
                        <Progress value={(data.users / 100) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12">{data.users}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Páginas */}
            <Card>
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
                <CardDescription>Ranking de páginas por visualizações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium text-sm">{page.page}</div>
                          <div className="text-xs text-muted-foreground">
                            {page.uniqueVisitors.toLocaleString()} visitantes únicos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {page.views.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {page.avgTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métricas de Qualidade */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Qualidade</CardTitle>
                <CardDescription>Indicadores de experiência do usuário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Rejeição</span>
                  <span className="font-medium text-green-600">{analytics.bounceRate}%</span>
                </div>
                <Progress value={100 - analytics.bounceRate} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Avaliação Média das Aulas</span>
                  <span className="font-medium text-yellow-600">{analytics.averageRating}/5.0</span>
                </div>
                <Progress value={(analytics.averageRating / 5) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Conclusão de Aulas</span>
                  <span className="font-medium text-green-600">
                    {Math.round((analytics.completedLessons / analytics.totalLessons) * 100)}%
                  </span>
                </div>
                <Progress value={(analytics.completedLessons / analytics.totalLessons) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime do Sistema</span>
                  <span className="font-medium text-green-600">{analytics.systemUptime}%</span>
                </div>
                <Progress value={analytics.systemUptime} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance do Sistema</CardTitle>
                <CardDescription>Métricas técnicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tempo de resposta médio</span>
                  <span className="font-medium text-green-600">245ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime mensal</span>
                  <span className="font-medium text-green-600">{analytics.systemUptime}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Erros por hora</span>
                  <span className="font-medium text-yellow-600">0.3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Requisições/min</span>
                  <span className="font-medium">1,240</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento</CardTitle>
                <CardDescription>Tendências de crescimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Novos usuários (semana)</span>
                  <span className="font-medium text-blue-600">+12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crescimento receita</span>
                  <span className="font-medium text-green-600">+{analytics.revenueGrowth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aulas agendadas</span>
                  <span className="font-medium text-purple-600">+156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de churn</span>
                  <span className="font-medium text-orange-600">2.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas</CardTitle>
                <CardDescription>Progresso das metas mensais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Novos usuários</span>
                    <span className="text-sm font-medium">24 / 50</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Receita mensal</span>
                    <span className="text-sm font-medium">R$ 45.680 / R$ 60.000</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Aulas completadas</span>
                    <span className="text-sm font-medium">1.189 / 1.500</span>
                  </div>
                  <Progress value={79} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Conteúdo</CardTitle>
                <CardDescription>Uso de funcionalidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de aulas</span>
                  <span className="font-medium">{analytics.totalLessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aulas concluídas</span>
                  <span className="font-medium text-green-600">{analytics.completedLessons}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Posts no fórum</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Interações com IA</span>
                  <span className="font-medium">1,567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Downloads de material</span>
                  <span className="font-medium">890</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação do Cliente</CardTitle>
                <CardDescription>Feedback e avaliações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avaliação média</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{analytics.averageRating}/5.0</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de satisfação</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">NPS Score</span>
                  <span className="font-medium text-blue-600">67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Reclamações resolvidas</span>
                  <span className="font-medium text-green-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tempo médio de resposta</span>
                  <span className="font-medium">2.3h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminAnalytics;