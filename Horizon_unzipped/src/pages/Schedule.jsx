import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('agendar'); // 'agendar' or 'minhas-aulas'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('');

  const instructors = [
    { id: 'ana', name: 'Prof. Ana Costa' },
    { id: 'carlos', name: 'Prof. Carlos Silva' },
    { id: 'roberto', name: 'Prof. Roberto Santos' },
  ];

  const classTypes = [
    { id: 'individual', name: 'Aula Individual' },
    { id: 'group', name: 'Aula em Grupo' },
  ];

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const myClasses = [
    {
      id: 1,
      title: 'Conversação Avançada',
      instructor: 'Prof. Ana Costa',
      date: '2025-09-12',
      time: '14:00',
      duration: '50 min',
      type: 'individual',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Gramática Prática',
      instructor: 'Prof. Carlos Silva',
      date: '2025-09-13',
      time: '16:30',
      duration: '45 min',
      type: 'group',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Business English',
      instructor: 'Prof. Roberto Santos',
      date: '2025-09-15',
      time: '10:00',
      duration: '60 min',
      type: 'individual',
      status: 'pending'
    }
  ];

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedInstructor || !selectedClassType) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos para agendar a aula.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "🎉 Aula Agendada!",
      description: `Sua aula de ${selectedClassType === 'individual' ? 'individual' : 'em grupo'} com ${selectedInstructor} em ${selectedDate} às ${selectedTime} foi agendada com sucesso.`,
    });
    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedInstructor('');
    setSelectedClassType('');
  };

  const handleCancelClass = (classId) => {
    toast({
      title: "❌ Cancelamento de Aula",
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
    // In a real app, you'd send an API request to cancel the class
  };

  const handleJoinClass = (classItem) => {
    toast({
      title: `🎥 Entrar na Aula - ${classItem.title}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Agendamento de Aulas</h1>
        <p className="text-white/70 text-lg">
          Agende sua próxima aula ou visualize seus horários.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 bg-white/10 rounded-lg p-1 max-w-md mx-auto"
      >
        <button
          onClick={() => setActiveTab('agendar')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 ${
            activeTab === 'agendar'
              ? 'bg-white text-blue-900 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Agendar Nova Aula
        </button>
        <button
          onClick={() => setActiveTab('minhas-aulas')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 ${
            activeTab === 'minhas-aulas'
              ? 'bg-white text-blue-900 shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Minhas Aulas
        </button>
      </motion.div>

      {activeTab === 'agendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="text-blue-400" size={24} />
            Agendar Nova Aula
          </h2>
          <form onSubmit={handleScheduleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="classDate" className="text-white">Data da Aula</Label>
              <Input
                id="classDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white/10 text-white border-white/20 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classTime" className="text-white">Horário</Label>
              <Select onValueChange={setSelectedTime} value={selectedTime}>
                <SelectTrigger id="classTime" className="bg-white/10 text-white border-white/20 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {availableTimes.map(time => (
                    <SelectItem key={time} value={time} className="hover:bg-gray-700">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-white">Professor(a)</Label>
              <Select onValueChange={setSelectedInstructor} value={selectedInstructor}>
                <SelectTrigger id="instructor" className="bg-white/10 text-white border-white/20 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {instructors.map(inst => (
                    <SelectItem key={inst.id} value={inst.name} className="hover:bg-gray-700">
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classType" className="text-white">Tipo de Aula</Label>
              <Select onValueChange={setSelectedClassType} value={selectedClassType}>
                <SelectTrigger id="classType" className="bg-white/10 text-white border-white/20 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione o tipo de aula" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {classTypes.map(type => (
                    <SelectItem key={type.id} value={type.id} className="hover:bg-gray-700">
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="btn-primary w-full">
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'minhas-aulas' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-green-400" size={24} />
            Minhas Aulas Agendadas
          </h2>
          <div className="space-y-4">
            {myClasses.length > 0 ? (
              myClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{classItem.title}</h3>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <User size={14} />
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      classItem.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {classItem.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{classItem.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{classItem.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleJoinClass(classItem)}
                      className="btn-primary flex-1 text-sm"
                      disabled={classItem.status === 'pending'}
                    >
                      Entrar na Aula
                    </Button>
                    <Button
                      onClick={() => handleCancelClass(classItem.id)}
                      className="btn-secondary flex-1 text-sm"
                      disabled={classItem.status === 'confirmed'}
                    >
                      Cancelar
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-white/70 text-center">Nenhuma aula agendada ainda.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Schedule;