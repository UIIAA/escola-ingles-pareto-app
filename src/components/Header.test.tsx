import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/__tests__/test-utils';
import Header from './Header';

// Mock the useToast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    dismiss: vi.fn(),
  }),
}));

// Mock the lucide-react library
vi.mock('lucide-react', () => ({
  Menu: () => 'Menu',
  Bell: () => 'Bell',
  Search: () => 'Search',
  User: () => 'User',
  LogOut: () => 'LogOut',
  Settings: () => 'Settings',
}));

// Mock the DropdownMenu component
vi.mock('@/components/ui/dropdown-menu', async () => {
  const actual = await vi.importActual('@/components/ui/dropdown-menu');
  return {
    ...actual,
    DropdownMenu: ({ children }) => <>{children}</>,
    DropdownMenuTrigger: ({ children }) => <>{children}</>,
    DropdownMenuContent: ({ children }) => <>{children}</>,
    DropdownMenuItem: ({ children, ...props }) => <div {...props}>{children}</div>,
  };
});

describe('Header', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it('renders the header with user information', () => {
    render(<Header onMenuClick={() => {}} />);
    expect(screen.getByText('Marcos Cruz')).toBeInTheDocument();
    expect(screen.getByText('marcos@exemplo.com')).toBeInTheDocument();
  });

  it('calls onMenuClick when the menu button is clicked', () => {
    const onMenuClick = vi.fn();
    render(<Header onMenuClick={onMenuClick} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('shows a toast message when the search button is clicked', () => {
    render(<Header onMenuClick={() => {}} />);
    const searchInput = screen.getByPlaceholderText('Buscar aulas, professores, tópicos...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const searchButton = screen.getByRole('button', { name: /Buscar/i });
    fireEvent.click(searchButton);
    expect(mockToast).toHaveBeenCalledWith({
      title: '🔍 Buscando...',
      description: `Resultados para: "test"`,
    });
  });

  it('shows a toast message when the notification button is clicked', () => {
    render(<Header onMenuClick={() => {}} />);
    const notificationButton = screen.getByText('Bell');
    fireEvent.click(notificationButton);
    expect(mockToast).toHaveBeenCalledWith({
      title: '🔔 Notificações',
      description: 'Você tem 3 novas notificações',
    });
  });

  it('shows a toast message when the logout button is clicked', async () => {
    render(<Header onMenuClick={() => {}} />);
    const userMenu = screen.getByText('Marcos Cruz');
    fireEvent.click(userMenu);
    const logoutButton = await screen.findByTestId('logout-button');
    fireEvent.click(logoutButton);
    expect(mockToast).toHaveBeenCalledWith({
      title: '👋 Saindo...',
      description: 'Você foi desconectado com sucesso',
    });
  });
});