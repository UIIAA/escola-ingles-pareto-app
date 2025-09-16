import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Bell } from 'lucide-react';
import UpcomingClasses from '@/components/UpcomingClasses';
import QuickActions from '@/components/QuickActions';

const Dashboard = () => {
  const stats = [
    {
      title: 'Próximas Aulas',
      value: '3',
      icon: Calendar,
      color: 'from-blue-400 to-cyan-400',
      change: '+2 esta semana'
    },
    {
      title: 'Horas Agendadas',
      value: '24h',
      icon: Clock,
      color: 'from-green-400 to-emerald-400',
      change: '+5h este mês'
    },
    {
      title: 'Alunos Ativos',
      value: '12',
      icon: User,
      color: 'from-blue-400 to-green-400',
      change: '+3 novos'
    },
    {
      title: 'Notificações',
      value: '5',
      icon: Bell,
      color: 'from-red-400 to-orange-400',
      change: 'Novas'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta! 👋
            </h1>
            <p className="text-white/70 text-lg">
              Gerencie seus agendamentos de aulas de forma eficiente.
            </p>
          </div>
          <div className="hidden md:block">
            <img  alt="Estudante sorrindo com livro de inglês" className="w-32 h-32 rounded-full object-cover" src="https://images.unsplash.com/photo-1546876116-2a6c8e3b2e7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.change}</div>
              </div>
            </div>
            <h3 className="text-white/80 font-medium">{stat.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <UpcomingClasses />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;