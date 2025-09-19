import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  X,
  Clock,
  Zap,
  BookOpen,
  CreditCard,
  MessageSquare,
  Bot,
  GraduationCap,
  User,
  Settings,
  Target
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  path: string;
  description?: string;
  requiredRoles?: ('student' | 'teacher' | 'master')[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || 'student';

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', description: 'Visão geral' },
    { icon: BookOpen, label: 'Catálogo de Aulas', path: '/catalog', description: 'Explorar aulas disponíveis', requiredRoles: ['teacher', 'master'] },
    { icon: Calendar, label: 'Agendamento', path: '/schedule', description: 'Agendar aulas' },
    { icon: Target, label: 'Aprendizado', path: '/learning', description: 'Trilhas e progresso' },
    { icon: MessageSquare, label: 'Fórum', path: '/forum', description: 'Discussões e dúvidas' },
    { icon: Bot, label: 'Chat IA', path: '/ai-chat', description: 'Prática com IA' },
    { icon: CreditCard, label: 'Créditos', path: '/credits', description: 'Gerenciar créditos' },
    { icon: GraduationCap, label: 'Ensino', path: '/teaching', description: 'Área do professor', requiredRoles: ['teacher', 'master'] },
    { icon: User, label: 'Perfil', path: '/profile', description: 'Meu perfil' },
    { icon: Settings, label: 'Admin', path: '/admin', description: 'Administração', requiredRoles: ['master'] },
  ];

  // Filtrar menu items baseado no role do usuário
  const filteredMenuItems = menuItems.filter(item =>
    !item.requiredRoles || item.requiredRoles.includes(userRole as 'student' | 'teacher' | 'master')
  );

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 z-50 lg:translate-x-0 lg:static lg:z-auto shadow-2xl"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Escola Inglês Pareto</h1>
                <p className="text-sm text-blue-200 mt-1">Plataforma de Ensino</p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden text-white hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg border border-white/20'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium block">{item.label}</span>
                        {item.description && (
                          <span className={`text-xs block mt-1 ${
                            isActive ? 'text-blue-100' : 'text-white/50 group-hover:text-white/70'
                          }`}>
                            {item.description}
                          </span>
                        )}
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Quick Tip */}
          <div className="p-4 m-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Zap size={16} className="text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">💡 Dica do Dia</h3>
                <p className="text-xs text-white/80 mb-2">
                  Explore o catálogo de aulas para encontrar tópicos do seu interesse!
                </p>
                <div className="flex items-center gap-1 text-xs text-cyan-300">
                  <Clock size={12} />
                  <span>Sempre aprendendo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/50">Versão 2.0</p>
              <p className="text-xs text-white/30 mt-1">© 2024 Escola Inglês Pareto</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;