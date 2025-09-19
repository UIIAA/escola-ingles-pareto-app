import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import StudentBooking from '../components/StudentBooking'
import { AuthContext } from '../contexts/AuthContext'

// Mock dependencies
vi.mock('../services/google-calendar', () => ({
  googleCalendarService: {
    getAvailableTimeSlots: vi.fn(() => Promise.resolve([
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true }
    ]))
  }
}))

vi.mock('../hooks/useCredits', () => ({
  useCredits: () => ({
    credits: 100,
    loading: false,
    error: null,
    purchaseCredits: vi.fn(),
    refreshCredits: vi.fn()
  })
}))

vi.mock('../hooks/useBookings', () => ({
  useBookings: () => ({
    bookings: [],
    loading: false,
    createBooking: vi.fn(() => Promise.resolve(true)),
    cancelBooking: vi.fn(() => Promise.resolve(true))
  })
}))

// Test wrapper with necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      name: 'Test User',
      role: 'student'
    }
  }

  const mockAuthValue = {
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn()
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthValue}>
        {children}
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('Booking System Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('StudentBooking Component', () => {
    it('should render booking form correctly', () => {
      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Check if main booking elements are present
      expect(screen.getByText(/agendar.*aula|schedule.*lesson/i)).toBeInTheDocument()
      expect(screen.getByText(/créditos.*disponíveis|available.*credits/i)).toBeInTheDocument()
    })

    it('should display available time slots', async () => {
      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Wait for time slots to load
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
        expect(screen.getByText('10:00')).toBeInTheDocument()
        expect(screen.getByText('14:00')).toBeInTheDocument()
      })

      // Check that unavailable slot is marked differently
      const unavailableSlot = screen.getByText('11:00')
      expect(unavailableSlot.closest('button')).toBeDisabled()
    })

    it('should allow date selection', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Find date picker or calendar component
      const dateInput = screen.getByRole('button', { name: /data|date/i })
      await user.click(dateInput)

      // Should open date picker
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('should handle time slot selection', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Wait for slots to load
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
      })

      // Click on available time slot
      const timeSlot = screen.getByText('09:00')
      await user.click(timeSlot)

      // Should be selected (visual feedback)
      expect(timeSlot.closest('button')).toHaveAttribute('data-selected', 'true')
    })

    it('should show teacher selection', async () => {
      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Should have teacher selection dropdown
      expect(screen.getByText(/professor|teacher/i)).toBeInTheDocument()

      const teacherSelect = screen.getByRole('combobox', { name: /professor|teacher/i })
      expect(teacherSelect).toBeInTheDocument()
    })

    it('should display booking confirmation dialog', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
      })

      // Select time slot
      await user.click(screen.getByText('09:00'))

      // Click book lesson button
      const bookButton = screen.getByRole('button', { name: /agendar.*aula|book.*lesson/i })
      await user.click(bookButton)

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/confirmar.*agendamento|confirm.*booking/i)).toBeInTheDocument()
      })
    })

    it('should handle booking creation', async () => {
      const user = userEvent.setup()
      const mockCreateBooking = vi.fn(() => Promise.resolve(true))

      // Override the mock for this specific test
      vi.doMock('../hooks/useBookings', () => ({
        useBookings: () => ({
          bookings: [],
          loading: false,
          createBooking: mockCreateBooking,
          cancelBooking: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Wait for form to load and select time
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
      })

      await user.click(screen.getByText('09:00'))

      // Submit booking
      const bookButton = screen.getByRole('button', { name: /agendar.*aula|book.*lesson/i })
      await user.click(bookButton)

      // Confirm in dialog
      const confirmButton = screen.getByRole('button', { name: /confirmar|confirm/i })
      await user.click(confirmButton)

      // Should call create booking
      await waitFor(() => {
        expect(mockCreateBooking).toHaveBeenCalled()
      })
    })

    it('should show credit validation', async () => {
      // Mock insufficient credits
      vi.doMock('../hooks/useCredits', () => ({
        useCredits: () => ({
          credits: 0,
          loading: false,
          error: null,
          purchaseCredits: vi.fn(),
          refreshCredits: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Should show insufficient credits message
      await waitFor(() => {
        expect(screen.getByText(/créditos.*insuficientes|insufficient.*credits/i)).toBeInTheDocument()
      })

      // Book button should be disabled
      const bookButton = screen.getByRole('button', { name: /agendar.*aula|book.*lesson/i })
      expect(bookButton).toBeDisabled()
    })

    it('should handle loading states', async () => {
      // Mock loading state
      vi.doMock('../hooks/useCredits', () => ({
        useCredits: () => ({
          credits: 0,
          loading: true,
          error: null,
          purchaseCredits: vi.fn(),
          refreshCredits: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Should show loading indicator
      expect(screen.getByTestId('loading-indicator') || screen.getByText(/carregando|loading/i)).toBeInTheDocument()
    })

    it('should handle booking errors', async () => {
      const user = userEvent.setup()
      const mockCreateBooking = vi.fn(() => Promise.resolve(false))

      vi.doMock('../hooks/useBookings', () => ({
        useBookings: () => ({
          bookings: [],
          loading: false,
          createBooking: mockCreateBooking,
          cancelBooking: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Complete booking flow
      await waitFor(() => {
        expect(screen.getByText('09:00')).toBeInTheDocument()
      })

      await user.click(screen.getByText('09:00'))
      await user.click(screen.getByRole('button', { name: /agendar.*aula|book.*lesson/i }))
      await user.click(screen.getByRole('button', { name: /confirmar|confirm/i }))

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/erro.*agendamento|booking.*error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Booking Validation', () => {
    it('should validate required fields', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Try to book without selecting time
      const bookButton = screen.getByRole('button', { name: /agendar.*aula|book.*lesson/i })
      await user.click(bookButton)

      // Should show validation error
      expect(screen.getByText(/selecione.*horário|select.*time/i)).toBeInTheDocument()
    })

    it('should prevent double booking', async () => {
      // Mock existing booking
      vi.doMock('../hooks/useBookings', () => ({
        useBookings: () => ({
          bookings: [{
            id: 1,
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            status: 'confirmed'
          }],
          loading: false,
          createBooking: vi.fn(),
          cancelBooking: vi.fn()
        })
      }))

      render(
        <TestWrapper>
          <StudentBooking />
        </TestWrapper>
      )

      // Should show already booked message or disable slot
      await waitFor(() => {
        const slot = screen.getByText('09:00')
        expect(slot.closest('button')).toBeDisabled()
      })
    })
  })
});