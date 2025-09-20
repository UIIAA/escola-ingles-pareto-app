import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useResponsive } from '@/hooks/use-responsive';
import {
  LayoutDashboard,
  Calendar,
  X,
  BookOpen,
  CreditCard,
  MessageSquare,
  Bot,
  GraduationCap,
  User,
  Settings,
  Target
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
  description?: string;
  requiredRoles?: ('student' | 'teacher' | 'master')[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { mode, isOpen, isCollapsed, close } = useSidebar();
  const { isMobile, isTablet, isDesktop } = useResponsive();
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

  // Componente do item de menu
  const MenuItem: React.FC<{ item: MenuItem; isCollapsed: boolean }> = ({ item, isCollapsed }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const content = (
      <Link
        to={item.path}
        onClick={() => isMobile && close()}
        className={cn(
          "flex items-center rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-white/20 text-white shadow-lg border border-white/30"
            : "text-blue-100 hover:bg-white/10 hover:text-white",
          isCollapsed
            ? "justify-center w-12 h-12 mx-auto"
            : "justify-start gap-3 px-3 py-3"
        )}
      >
        <Icon
          size={20}
          className={cn(
            "transition-transform duration-200 flex-shrink-0",
            isActive ? "scale-110" : "group-hover:scale-105"
          )}
        />

        {/* Texto - oculto quando collapsed */}
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "sidebar-content-collapsed" : "sidebar-content-expanded"
        )}>
          <div className="font-medium text-sm leading-tight">{item.label}</div>
          {item.description && (
            <div className="text-xs text-blue-200 mt-0.5 leading-tight">
              {item.description}
            </div>
          )}
        </div>

        {/* Indicador ativo */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );

    // Wrap com tooltip quando collapsed
    if (isCollapsed && isDesktop) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <div>{item.label}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {item.description}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  // Variantes de animação
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  // Classes baseadas no modo atual
  const sidebarClasses = cn(
    "bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl",
    "flex flex-col h-full relative",
    // Posicionamento por device type
    isMobile && "fixed left-0 top-0 z-50 w-72",
    isTablet && "fixed left-0 top-0 z-40 w-72",
    isDesktop && "fixed left-0 top-0 z-30",
    // Width desktop baseada no collapsed state
    isDesktop && mode === 'collapsed' && "w-16",
    isDesktop && mode !== 'collapsed' && "w-72",
    // Transições
    isDesktop && "transition-all duration-300 ease-in-out"
  );

  return (
    <TooltipProvider>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={isMobile ? sidebarVariants : undefined}
        animate={isMobile ? (isOpen ? 'open' : 'closed') : undefined}
        initial={isMobile ? "closed" : false}
        className={sidebarClasses}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className={cn(
          "p-6 border-b border-white/10",
          isCollapsed && isDesktop && "px-3 py-6"
        )}>
          <div className="flex items-center justify-between">
            <div className={cn(
              "transition-all duration-300",
              isCollapsed && isDesktop ? "sidebar-content-collapsed" : "sidebar-content-expanded"
            )}>
              <h1 className="text-xl font-bold text-white">Escola Inglês Pareto</h1>
              <p className="text-sm text-blue-200 mt-1">Plataforma de Ensino</p>
            </div>

            {/* Logo collapsed - apenas ícone */}
            <div className={cn(
              "transition-all duration-300",
              isCollapsed && isDesktop ? "sidebar-content-expanded" : "sidebar-content-collapsed"
            )}>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard size={20} className="text-white" />
              </div>
            </div>

            {/* Botão fechar - apenas mobile/tablet */}
            {!isDesktop && (
              <button
                onClick={close}
                className="text-white hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-white/10"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 space-y-1 overflow-y-auto",
          isCollapsed && isDesktop ? "p-2" : "p-4"
        )}>
          {filteredMenuItems.map((item, index) => (
            <MenuItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed && isDesktop}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-white/10",
          isCollapsed && isDesktop && "px-2"
        )}>
          <div className={cn(
            "text-center transition-all duration-300",
            isCollapsed && isDesktop ? "sidebar-content-collapsed" : "sidebar-content-expanded"
          )}>
            <p className="text-xs text-blue-200">
              v1.0.0 - Responsive Ready
            </p>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default Sidebar;