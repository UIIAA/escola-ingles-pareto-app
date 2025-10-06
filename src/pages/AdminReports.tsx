import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar as CalendarIcon,
  FileText,
  Target,
  MessageSquare,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Dados de receita mensal
  const revenueData = [
    { month: 'Jan', revenue: 8500, students: 34, lessons: 156 },
    { month: 'Fev', revenue: 10200, students: 42, lessons: 189 },
    { month: 'Mar', revenue: 12300, students: 51, lessons: 224 },
    { month: 'Abr', revenue: 14800, students: 58, lessons: 267 },
    { month: 'Mai', revenue: 16200, students: 67, lessons: 298 },
    { month: 'Jun', revenue: 18900, students: 74, lessons: 334 },
    { month: 'Jul', revenue: 21500, students: 82, lessons: 378 },
    { month: 'Ago', revenue: 23800, students: 91, lessons: 412 },
    { month: 'Set', revenue: 26700, students: 103, lessons: 456 }
  ];

  // Dados de distribuição de aulas
  const lessonsDistribution = [
    { name: 'Grupo Iniciante', value: 156, color: '#22c55e' },
    { name: 'Grupo Intermediário', value: 189, color: '#3b82f6' },
    { name: 'Grupo Avançado', value: 124, color: '#a855f7' },
    { name: 'Conversação Aberta', value: 98, color: '#f59e0b' },
    { name: 'Individual', value: 67, color: '#ec4899' }
  ];

  // Dados de engajamento
  const engagementData = [
    { name: 'Aulas Agendadas', value: 456, icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Fórum - Tópicos', value: 234, icon: MessageSquare, color: 'bg-purple-500' },
    { name: 'AI Chat - Sessões', value: 789, icon: Target, color: 'bg-green-500' },
    { name: 'Trilhas Completadas', value: 145, icon: Award, color: 'bg-orange-500' }
  ];

  // Dados de crescimento de alunos
  const studentGrowthData = [
    { month: 'Jan', active: 28, new: 6, churned: 2 },
    { month: 'Fev', active: 34, new: 8, churned: 2 },
    { month: 'Mar', active: 42, new: 10, churned: 2 },
    { month: 'Abr', active: 51, new: 11, churned: 2 },
    { month: 'Mai', active: 58, new: 9, churned: 2 },
    { month: 'Jun', active: 67, new: 12, churned: 3 },
    { month: 'Jul', active: 74, new: 10, churned: 3 },
    { month: 'Ago', active: 82, new: 11, churned: 3 },
    { month: 'Set', active: 91, new: 13, churned: 4 }
  ];

  // Dados de performance de professores
  const teacherPerformance = [
    { name: 'Ana Silva', lessons: 89, rating: 4.9, students: 34, revenue: 8450 },
    { name: 'Carlos Oliveira', lessons: 76, rating: 4.8, students: 28, revenue: 7200 },
    { name: 'Maria Santos', lessons: 67, rating: 4.7, students: 25, revenue: 6350 },
    { name: 'Pedro Costa', lessons: 54, rating: 4.6, students: 21, revenue: 5100 },
    { name: 'Julia Ferreira', lessons: 45, rating: 4.8, students: 18, revenue: 4250 }
  ];

  // KPIs principais
  const kpis = {
    totalRevenue: 26700,
    monthlyGrowth: 12.2,
    activeStudents: 103,
    studentGrowth: 13.2,
    totalLessons: 456,
    lessonGrowth: 10.7,
    avgRating: 4.8,
    satisfactionRate: 96
  };

  const handleExportReport = (reportType: string) => {
    console.log(`Exportando relatório: ${reportType}`);
    // TODO: Implementar export real
  };

  const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];

  return (
    <AdminPageLayout
      title="Relatórios e Analytics"
      description="Visualize métricas e gere relatórios customizados"
    >
      <div className="space-y-6">
        {/* Filtros e Controles */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="12m">Últimos 12 meses</SelectItem>
                    <SelectItem value="custom">Período customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPeriod === 'custom' && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Inicial</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, 'PP', { locale: ptBR }) : 'Selecionar'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Data Final</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, 'PP', { locale: ptBR }) : 'Selecionar'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}

              <Button onClick={() => handleExportReport(selectedReport)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principais */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {kpis.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpis.monthlyGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.activeStudents}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpis.studentGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalLessons}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpis.lessonGrowth}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.satisfactionRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                Avaliação média: {kpis.avgRating}⭐
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Relatórios */}
        <Tabs value={selectedReport} onValueChange={setSelectedReport}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="teachers">Professores</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de Receita</CardTitle>
                  <CardDescription>Últimos 9 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Aulas</CardTitle>
                  <CardDescription>Por tipo de aula</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={lessonsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {lessonsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de Engajamento */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Engajamento</CardTitle>
                <CardDescription>Atividades da plataforma este mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {engagementData.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.name} className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${metric.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receita */}
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Receita</CardTitle>
                <CardDescription>Receita, alunos e aulas ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Receita (R$)" />
                    <Bar yAxisId="right" dataKey="lessons" fill="#22c55e" name="Aulas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alunos */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Alunos</CardTitle>
                <CardDescription>Alunos ativos, novos e churn</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={studentGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} name="Ativos" />
                    <Line type="monotone" dataKey="new" stroke="#22c55e" strokeWidth={2} name="Novos" />
                    <Line type="monotone" dataKey="churned" stroke="#ef4444" strokeWidth={2} name="Churn" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professores */}
          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Professores</CardTitle>
                <CardDescription>Top 5 professores por métricas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {teacherPerformance.map((teacher, index) => (
                    <div key={teacher.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="w-8 h-8 flex items-center justify-center">
                            #{index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.students} alunos • {teacher.lessons} aulas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {teacher.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">⭐ {teacher.rating}</p>
                        </div>
                      </div>
                      <Progress value={(teacher.rating / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Pré-Definidos</CardTitle>
            <CardDescription>Gere relatórios rapidamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button variant="outline" onClick={() => handleExportReport('daily')}>
                <FileText className="h-4 w-4 mr-2" />
                Relatório Diário
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('weekly')}>
                <FileText className="h-4 w-4 mr-2" />
                Relatório Semanal
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('monthly')}>
                <FileText className="h-4 w-4 mr-2" />
                Relatório Mensal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminReports;
