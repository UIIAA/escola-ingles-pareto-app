import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'marcos@exemplo.com',
            user_metadata: {
              name: 'Marcos Cruz',
              role: 'student',
              avatar_url: 'https://example.com/avatar.jpg'
            },
            created_at: '2024-01-01T00:00:00.000Z'
          }
        },
        error: null
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
      }))
    }))
  }
}));

// Mock the contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'marcos@exemplo.com',
      user_metadata: {
        name: 'Marcos Cruz',
        role: 'student',
        avatar_url: 'https://example.com/avatar.jpg'
      },
      created_at: '2024-01-01T00:00:00.000Z'
    },
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    updateUserMetadata: vi.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/contexts/SidebarContext', () => ({
  useSidebar: () => ({
    isOpen: false,
    setIsOpen: vi.fn(),
    toggle: vi.fn()
  }),
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock responsive hook
vi.mock('@/hooks/use-responsive', () => ({
  useResponsive: () => ({
    width: 1200,
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    legacy_isMobile: false
  })
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: []
  })
}));

// Custom render function with router
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
      <Toaster />
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };