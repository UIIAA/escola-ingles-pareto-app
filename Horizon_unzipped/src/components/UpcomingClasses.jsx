import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const UpcomingClasses = () => {
  const classes = [
    {
      id: 1,
      title: 'Conversação Avançada',
      instructor: 'Prof. Ana Costa',
      date: 'Hoje',
      time: '14:00',
      duration: '50 min',
      type: 'individual',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Gramática Prática',
      instructor: 'Prof. Carlos Silva',
      date: 'Amanhã',
      time: '16:30',
      duration: '45 min',
      type: 'group',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Business English',
      instructor: 'Prof. Roberto Santos',
      date: '15 Nov',
      time: '10:00',
      duration: '60 min',
      type: 'individual',
      status: 'pending'
    }
  ];

  const handleJoinClass = (classItem) => {
    toast({
      title: `🎥 Entrar na Aula - ${classItem.title}`,
      description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Calendar className="text-blue-400" size={24} />
        Próximas Aulas
      </h2>
      
      <div className="space-y-4">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
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
              <div className="flex items-center gap-1">
                <Video size={14} />
                <span>{classItem.duration}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleJoinClass(classItem)}
                className="btn-primary flex-1 text-sm"
                disabled={classItem.status === 'pending'}
              >
                <Video size={16} className="mr-2" />
                {classItem.date === 'Hoje' ? 'Entrar' : 'Agendar'}
              </Button>
              
              {classItem.type === 'group' && (
                <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium flex items-center">
                  Grupo
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button
        onClick={() => toast({ title: "📅 Ver Todas as Aulas", description: "🚧 Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀" })}
        variant="ghost"
        className="w-full mt-4 text-white hover:bg-white/10"
      >
        Ver todas as aulas
      </Button>
    </motion.div>
  );
};

export default UpcomingClasses;