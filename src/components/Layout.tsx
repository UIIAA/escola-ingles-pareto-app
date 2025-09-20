import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar, useSidebarWidth } from '@/contexts/SidebarContext';
import { useResponsive } from '@/hooks/use-responsive';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

// Layout interno que usa o context
const LayoutInternal: React.FC<LayoutProps> = ({ children }) => {
  const { deviceType, mode, toggle } = useSidebar();
  const sidebarWidth = useSidebarWidth();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Calcular margin do conteúdo principal usando Tailwind
  const mainMarginClass = React.useMemo(() => {
    if (isMobile) return 'ml-0'; // Mobile: sem margin
    if (isTablet) return 'ml-72'; // Tablet: sidebar fixa 288px
    if (mode === 'collapsed') return 'ml-16'; // Desktop collapsed: 64px
    return 'ml-72'; // Desktop expanded: 288px
  }, [isMobile, isTablet, mode]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Sidebar com nova lógica responsiva */}
      <Sidebar />

      {/* Conteúdo principal com margem dinâmica */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        mainMarginClass
      )}>
        <Header onMenuClick={toggle} />

        <main className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Debug info em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Device: {deviceType}</div>
          <div>Mode: {mode}</div>
          <div>Width: {sidebarWidth}</div>
        </div>
      )}
    </div>
  );
};

// Layout principal que fornece o context
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <LayoutInternal>{children}</LayoutInternal>
    </SidebarProvider>
  );
};

export default Layout;