import * as React from "react";

// Breakpoints seguindo o padrão Tailwind CSS
const BREAKPOINTS = {
  mobile: 768,    // < 768px
  desktop: 1024,  // >= 1024px
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveState {
  width: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  // Compatibilidade com hook anterior
  legacy_isMobile: boolean;
}

export function useResponsive(): ResponsiveState {
  const [width, setWidth] = React.useState<number>(() => {
    // SSR safe default
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth;
  });

  React.useEffect(() => {
    // Debounced resize handler para performance
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 100);
    };

    // Media query listeners para cada breakpoint
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);

    const handleMediaChange = () => {
      setWidth(window.innerWidth);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    mobileQuery.addEventListener('change', handleMediaChange);
    desktopQuery.addEventListener('change', handleMediaChange);

    // Set initial value
    setWidth(window.innerWidth);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      mobileQuery.removeEventListener('change', handleMediaChange);
      desktopQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Determine device type
  const deviceType: DeviceType = React.useMemo(() => {
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.desktop) return 'tablet';
    return 'desktop';
  }, [width]);

  // Derived state
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // Compatibilidade com hook anterior
  const legacy_isMobile = width < BREAKPOINTS.mobile;

  return React.useMemo(() => ({
    width,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    legacy_isMobile
  }), [width, deviceType, isMobile, isTablet, isDesktop, legacy_isMobile]);
}

// Hook de compatibilidade para não quebrar código existente
export function useIsMobile() {
  const { legacy_isMobile } = useResponsive();
  return legacy_isMobile;
}

// Hooks específicos para melhor legibilidade
export function useIsDesktop() {
  const { isDesktop } = useResponsive();
  return isDesktop;
}

export function useIsTablet() {
  const { isTablet } = useResponsive();
  return isTablet;
}

// Context para compartilhar estado responsivo
const ResponsiveContext = React.createContext<ResponsiveState | null>(null);

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const responsiveState = useResponsive();

  return (
    <ResponsiveContext.Provider value={responsiveState}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveContext(): ResponsiveState {
  const context = React.useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsiveContext must be used within ResponsiveProvider');
  }
  return context;
}