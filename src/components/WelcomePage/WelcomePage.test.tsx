import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WelcomePage } from './WelcomePage'

describe('WelcomePage', () => {
  const mockOnLogout = vi.fn()
  const mockOnNavigateToCIAgent = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render welcome heading', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      expect(
        screen.getByText('Welcome to Commercial Engineering DevOps team page')
      ).toBeInTheDocument()
    })

    it('should render Configure CI Agent button', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      expect(
        screen.getByRole('button', { name: /configure ci agent/i })
      ).toBeInTheDocument()
    })

    it('should render Logout button', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      expect(
        screen.getByRole('button', { name: /logout/i })
      ).toBeInTheDocument()
    })

    it('should render both buttons in a button group', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('Button Interactions', () => {
    it('should call onNavigateToCIAgent when Configure CI Agent button is clicked', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const ciAgentButton = screen.getByRole('button', {
        name: /configure ci agent/i,
      })
      fireEvent.click(ciAgentButton)

      expect(mockOnNavigateToCIAgent).toHaveBeenCalledTimes(1)
      expect(mockOnLogout).not.toHaveBeenCalled()
    })

    it('should call onLogout when Logout button is clicked', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(logoutButton)

      expect(mockOnLogout).toHaveBeenCalledTimes(1)
      expect(mockOnNavigateToCIAgent).not.toHaveBeenCalled()
    })

    it('should handle multiple clicks on Configure CI Agent button', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const ciAgentButton = screen.getByRole('button', {
        name: /configure ci agent/i,
      })

      fireEvent.click(ciAgentButton)
      fireEvent.click(ciAgentButton)
      fireEvent.click(ciAgentButton)

      expect(mockOnNavigateToCIAgent).toHaveBeenCalledTimes(3)
    })

    it('should handle multiple clicks on Logout button', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const logoutButton = screen.getByRole('button', { name: /logout/i })

      fireEvent.click(logoutButton)
      fireEvent.click(logoutButton)

      expect(mockOnLogout).toHaveBeenCalledTimes(2)
    })
  })

  describe('Styling', () => {
    it('should render buttons with appropriate styling', () => {
      render(
        <WelcomePage
          onLogout={mockOnLogout}
          onNavigateToCIAgent={mockOnNavigateToCIAgent}
        />
      )

      const ciAgentButton = screen.getByRole('button', {
        name: /configure ci agent/i,
      })
      const logoutButton = screen.getByRole('button', { name: /logout/i })

      // Check that buttons have class attributes (CSS modules will hash the names)
      expect(ciAgentButton).toHaveAttribute('class')
      expect(logoutButton).toHaveAttribute('class')
    })
  })
})
