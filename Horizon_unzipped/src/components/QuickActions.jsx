import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Agendar Nova Aula',
      description: 'Marque sua próxima sessão de inglês',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/schedule')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-effect rounded-2xl p-6"
    >
      <h2 className="text-xl font-semibold text-white mb-6">Ações Rápidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Button
                onClick={action.action}
                className="w-full p-6 h-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                variant="ghost"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{action.title}</h3>
                    <p className="text-white/60 text-sm">{action.description}</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;