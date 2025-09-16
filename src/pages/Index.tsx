import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, CreditCard, Users } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">Sistema de Aulas de Inglês</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Aprenda Inglês de Forma <span className="text-blue-600">Personalizada</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Agende aulas com professores qualificados, gerencie seus créditos e acompanhe seu progresso em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">Acessar Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/schedule">Ver Horários</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-4" />
              <CardTitle>Aulas Personalizadas</CardTitle>
              <CardDescription>
                Escolha o professor e horário que melhor se adequam à sua rotina.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Conecte-se com professores nativos e especialistas em ensino de inglês.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-10 w-10 text-blue-600 mb-4" />
              <CardTitle>Agendamento Flexível</CardTitle>
              <CardDescription>
                Visualize disponibilidades em tempo real através do Google Calendar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Marque e remarque aulas conforme sua disponibilidade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CreditCard className="h-10 w-10 text-blue-600 mb-4" />
              <CardTitle>Sistema de Créditos</CardTitle>
              <CardDescription>
                Compre pacotes com descontos progressivos e gerencie suas aulas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Quanto mais aulas você compra, maior o desconto que recebe.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Como Funciona o Sistema
              </h2>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Compre créditos:</span> Escolha um pacote de aulas com desconto progressivo
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Escolha um professor:</span> Veja perfis e especialidades dos nossos professores
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Agende sua aula:</span> Selecione um horário disponível no calendário
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Participe da aula:</span> Conecte-se na hora marcada e comece a aprender
                  </p>
                </li>
              </ol>
            </div>
            <div className="md:w-1/2 bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Visualização dos professores disponíveis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para começar?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Junte-se a milhares de alunos que já estão transformando suas vidas com nosso método.
          </p>
          <Button size="lg" asChild>
            <Link to="/dashboard">Comece Agora</Link>
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;