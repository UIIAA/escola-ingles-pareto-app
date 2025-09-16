import { render, screen, fireEvent, within } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the dashboard for a student', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    expect(screen.getByText('Bem-vindo, Nome do Usuário')).toBeInTheDocument();
    expect(screen.getByText('Aluno')).toBeInTheDocument();
    const creditosCard = screen.getByText('Créditos Disponíveis').closest('div.rounded-lg');
    const proximasAulasCard = screen.getByText('Próximas Aulas').closest('div.rounded-lg');
    expect(creditosCard).toBeInTheDocument();
    expect(proximasAulasCard).toBeInTheDocument();
  });

  it('navigates to the credits page when the "Comprar créditos" button is clicked', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    const buyCreditsButton = screen.getByText('Comprar Créditos');
    fireEvent.click(buyCreditsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/credits');
  });

  it('navigates to the schedule page when the "Ver todas as aulas" button is clicked', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    const viewAllClassesButton = screen.getByText('Ver todas as aulas');
    fireEvent.click(viewAllClassesButton);
    expect(mockNavigate).toHaveBeenCalledWith('/schedule');
  });
});