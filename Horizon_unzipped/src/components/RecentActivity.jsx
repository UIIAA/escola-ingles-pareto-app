
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Play, Star } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'completed',
      title: 'Guia de Conversação do Dia a Dia',
      time: '2 horas atrás',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'started',
      title: 'Vocabulário de Negócios',
      time: '1 dia atrás',
      icon: Play,
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Alcançou nível B2 em Gramática',
      time: '2 dias atrás',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      id: 4,
      type: 'completed',
      title: 'Exercícios de Pronúncia - Básico',
      time: '3 dias atrás',
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Atividade Recente</h2>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-white/10 ${activity.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{activity.title}</h3>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock size={14} />
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
