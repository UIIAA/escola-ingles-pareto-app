import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useResponsive } from '@/hooks/use-responsive';

export type SidebarMode = 'overlay' | 'fixed' | 'collapsed';

interface SidebarState {
  // Estado por tipo de dispositivo
  mode: SidebarMode;
  isOpen: boolean;           // Para mobile overlay
  isCollapsed: boolean;      // Para desktop collapsed

  // Métodos de controle
  toggle: () => void;
  open: () => void;
  close: () => void;
  collapse: () => void;
  expand: () => void;

  // Estado responsivo
  deviceType: 'mobile' | 'tablet' | 'desktop';

  // Compatibilidade
  legacy_isOpen: boolean;
  legacy_onClose: () => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const { deviceType, isMobile, isTablet, isDesktop } = useResponsive();

  // Estados separados por funcionalidade
  const [isOpen, setIsOpen] = useState(false);           // Mobile overlay
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed); // Desktop collapsed

  // Determinar modo baseado no device type
  const mode: SidebarMode = React.useMemo(() => {
    if (isMobile) return 'overlay';
    if (isTablet) return 'fixed';
    return isCollapsed ? 'collapsed' : 'fixed';
  }, [isMobile, isTablet, isCollapsed]);

  // Persistir estado collapsed no localStorage
  useEffect(() => {
    if (isDesktop) {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    }
  }, [isDesktop]);

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isDesktop]);

  // Fechar overlay quando mudar para tablet/desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  // Métodos de controle
  const toggle = useCallback(() => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    } else if (isDesktop) {
      setIsCollapsed(prev => !prev);
    } else {
      // Tablet - mantém comportamento atual
      setIsOpen(prev => !prev);
    }
  }, [isMobile, isDesktop]);

  const open = useCallback(() => {
    if (isMobile || isTablet) {
      setIsOpen(true);
    }
  }, [isMobile, isTablet]);

  const close = useCallback(() => {
    if (isMobile || isTablet) {
      setIsOpen(false);
    }
  }, [isMobile, isTablet]);

  const collapse = useCallback(() => {
    if (isDesktop) {
      setIsCollapsed(true);
    }
  }, [isDesktop]);

  const expand = useCallback(() => {
    if (isDesktop) {
      setIsCollapsed(false);
    }
  }, [isDesktop]);

  // Compatibilidade com código existente
  const legacy_isOpen = isOpen;
  const legacy_onClose = close;

  const contextValue: SidebarState = {
    mode,
    isOpen,
    isCollapsed,
    toggle,
    open,
    close,
    collapse,
    expand,
    deviceType,
    legacy_isOpen,
    legacy_onClose
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarState {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

// Hook específico para verificar se sidebar está visível
export function useSidebarVisible(): boolean {
  const { mode, isOpen, deviceType } = useSidebar();

  if (deviceType === 'mobile') {
    return isOpen; // Overlay visível apenas quando aberto
  }

  return true; // Tablet e desktop sempre visível (fixed ou collapsed)
}

// Hook para largura atual da sidebar
export function useSidebarWidth(): string {
  const { mode, deviceType } = useSidebar();

  if (deviceType === 'mobile') {
    return '0px'; // Overlay não afeta layout
  }

  if (mode === 'collapsed') {
    return '4rem'; // 64px
  }

  return '18rem'; // 288px
}