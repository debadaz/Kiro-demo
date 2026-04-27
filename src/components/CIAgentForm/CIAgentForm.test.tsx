import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CIAgentForm } from './CIAgentForm'

describe('CIAgentForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the form with all required fields', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      expect(screen.getByText('CI Agent')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Capture CI onboarding details and required credentials.'
        )
      ).toBeInTheDocument()

      // Check all form fields are present
      expect(screen.getByLabelText(/Asset ID/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/GitHub Repository/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/GitHub PAT/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/GPG Key/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/App Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Tech Stack/i)).toBeInTheDocument()
      expect(
        screen.getByLabelText(/Artifactory Username/i)
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/Artifactory API Key/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Version/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Sonar Project Key/i)).toBeInTheDocument()
      expect(
        screen.getByLabelText(/Sonar Project Name/i)
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/Sonar Token/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Sonar Host URL/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Snyk Token/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Files/i)).toBeInTheDocument()
    })

    it('should render submit and reset buttons', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /reset/i })
      ).toBeInTheDocument()
    })

    it('should render back button', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      expect(
        screen.getByRole('button', { name: /back to agents/i })
      ).toBeInTheDocument()
    })

    it('should mark all fields as required', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const requiredMarkers = screen.getAllByText('*')
      expect(requiredMarkers.length).toBeGreaterThan(0)
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors when submitting empty form', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Asset ID is required')).toBeInTheDocument()
        expect(
          screen.getByText('GitHub Repository is required')
        ).toBeInTheDocument()
        expect(screen.getByText('GitHub PAT is required')).toBeInTheDocument()
        expect(screen.getByText('GPG Key is required')).toBeInTheDocument()
        expect(screen.getByText('App Name is required')).toBeInTheDocument()
        expect(screen.getByText('Tech Stack is required')).toBeInTheDocument()
        expect(
          screen.getByText('Artifactory Username is required')
        ).toBeInTheDocument()
        expect(
          screen.getByText('Artifactory API Key is required')
        ).toBeInTheDocument()
        expect(screen.getByText('Version is required')).toBeInTheDocument()
        expect(
          screen.getByText('Sonar Project Key is required')
        ).toBeInTheDocument()
        expect(
          screen.getByText('Sonar Project Name is required')
        ).toBeInTheDocument()
        expect(screen.getByText('Sonar Token is required')).toBeInTheDocument()
        expect(
          screen.getByText('Sonar Host URL is required')
        ).toBeInTheDocument()
        expect(screen.getByText('Snyk Token is required')).toBeInTheDocument()
        expect(screen.getByText('File is required')).toBeInTheDocument()
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it('should clear validation error when user starts typing', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Asset ID is required')).toBeInTheDocument()
      })

      const assetIdInput = screen.getByLabelText(/Asset ID/i)
      fireEvent.change(assetIdInput, { target: { value: 'TEST-123' } })

      await waitFor(() => {
        expect(
          screen.queryByText('Asset ID is required')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('File Upload Validation', () => {
    it('should accept valid JPEG file', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const file = new File(['dummy content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const fileInput = screen.getByLabelText(/Files/i) as HTMLInputElement

      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(fileInput.files?.[0]).toBe(file)
      })
    })

    it('should accept valid PNG file', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const file = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      })
      const fileInput = screen.getByLabelText(/Files/i) as HTMLInputElement

      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(fileInput.files?.[0]).toBe(file)
      })
    })

    it('should reject invalid file type', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const file = new File(['dummy content'], 'test.pdf', {
        type: 'application/pdf',
      })
      const fileInput = screen.getByLabelText(/Files/i) as HTMLInputElement

      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(
          screen.getByText('Only JPEG and PNG files are allowed')
        ).toBeInTheDocument()
      })
    })

    it('should reject file larger than 5 MB', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      // Create a file larger than 5 MB
      const largeContent = new Array(6 * 1024 * 1024).join('a')
      const file = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      })

      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })

      const fileInput = screen.getByLabelText(/Files/i) as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })

      await waitFor(() => {
        expect(
          screen.getByText('File size must not exceed 5 MB')
        ).toBeInTheDocument()
      })
    })

    it('should display file size hint', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      expect(
        screen.getByText(/Maximum size per file: 5 MB/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Accepted formats: JPEG, PNG/i)
      ).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    const fillFormWithValidData = () => {
      fireEvent.change(screen.getByLabelText(/Asset ID/i), {
        target: { value: 'ASSET-123' },
      })
      fireEvent.change(screen.getByLabelText(/GitHub Repository/i), {
        target: { value: 'https://github.com/test/repo' },
      })
      fireEvent.change(screen.getByLabelText(/GitHub PAT/i), {
        target: { value: 'ghp_test123' },
      })
      fireEvent.change(screen.getByLabelText(/GPG Key/i), {
        target: { value: 'GPG-KEY-123' },
      })
      fireEvent.change(screen.getByLabelText(/App Name/i), {
        target: { value: 'Test App' },
      })
      fireEvent.change(screen.getByLabelText(/Tech Stack/i), {
        target: { value: 'Node.js, React' },
      })
      fireEvent.change(screen.getByLabelText(/Artifactory Username/i), {
        target: { value: 'testuser' },
      })
      fireEvent.change(screen.getByLabelText(/Artifactory API Key/i), {
        target: { value: 'api-key-123' },
      })
      fireEvent.change(screen.getByLabelText(/Version/i), {
        target: { value: '1.0.0' },
      })
      fireEvent.change(screen.getByLabelText(/Sonar Project Key/i), {
        target: { value: 'test-project' },
      })
      fireEvent.change(screen.getByLabelText(/Sonar Project Name/i), {
        target: { value: 'Test Project' },
      })
      fireEvent.change(screen.getByLabelText(/Sonar Token/i), {
        target: { value: 'sonar-token-123' },
      })
      fireEvent.change(screen.getByLabelText(/Sonar Host URL/i), {
        target: { value: 'https://sonar.example.com' },
      })
      fireEvent.change(screen.getByLabelText(/Snyk Token/i), {
        target: { value: 'snyk-token-123' },
      })

      const file = new File(['dummy content'], 'test.jpg', {
        type: 'image/jpeg',
      })
      const fileInput = screen.getByLabelText(/Files/i) as HTMLInputElement
      fireEvent.change(fileInput, { target: { files: [file] } })
    }

    it('should show success message on valid form submission', async () => {
      vi.useFakeTimers()
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      fillFormWithValidData()

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(
        () => {
          expect(screen.getByText('✓ Success!')).toBeInTheDocument()
          expect(
            screen.getByText(
              'CI Agent configuration has been submitted successfully.'
            )
          ).toBeInTheDocument()
          expect(
            screen.getByText('Redirecting to welcome page...')
          ).toBeInTheDocument()
        },
        { timeout: 10000 }
      )

      vi.advanceTimersByTime(2000)

      await waitFor(
        () => {
          expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        },
        { timeout: 10000 }
      )

      vi.useRealTimers()
    }, 15000)

    it('should not submit form with missing fields', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      // Fill only some fields
      fireEvent.change(screen.getByLabelText(/Asset ID/i), {
        target: { value: 'ASSET-123' },
      })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(
        () => {
          expect(
            screen.getByText('GitHub Repository is required')
          ).toBeInTheDocument()
        },
        { timeout: 10000 }
      )

      expect(mockOnSuccess).not.toHaveBeenCalled()
    }, 15000)
  })

  describe('Reset Functionality', () => {
    it('should clear all form fields when reset button is clicked', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      // Fill some fields
      const assetIdInput = screen.getByLabelText(/Asset ID/i) as HTMLInputElement
      const appNameInput = screen.getByLabelText(/App Name/i) as HTMLInputElement

      fireEvent.change(assetIdInput, { target: { value: 'ASSET-123' } })
      fireEvent.change(appNameInput, { target: { value: 'Test App' } })

      expect(assetIdInput.value).toBe('ASSET-123')
      expect(appNameInput.value).toBe('Test App')

      const resetButton = screen.getByRole('button', { name: /reset/i })
      fireEvent.click(resetButton)

      await waitFor(
        () => {
          expect(assetIdInput.value).toBe('')
          expect(appNameInput.value).toBe('')
        },
        { timeout: 10000 }
      )
    }, 15000)

    it('should clear validation errors when reset button is clicked', async () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      await waitFor(
        () => {
          expect(screen.getByText('Asset ID is required')).toBeInTheDocument()
        },
        { timeout: 10000 }
      )

      const resetButton = screen.getByRole('button', { name: /reset/i })
      fireEvent.click(resetButton)

      await waitFor(
        () => {
          expect(
            screen.queryByText('Asset ID is required')
          ).not.toBeInTheDocument()
        },
        { timeout: 10000 }
      )
    }, 15000)
  })

  describe('Navigation', () => {
    it('should call onBack when back button is clicked', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      const backButton = screen.getByRole('button', {
        name: /back to agents/i,
      })
      fireEvent.click(backButton)

      expect(mockOnBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Input Placeholders', () => {
    it('should display appropriate placeholders for all fields', () => {
      render(<CIAgentForm onSuccess={mockOnSuccess} onBack={mockOnBack} />)

      expect(screen.getByPlaceholderText('Enter Asset ID')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Git Repository URL')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter GitHub personal access token')
      ).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Paste GPG key')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter application name')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('e.g. Java, Node.js, Python')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Artifactory username')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Artifactory API key')
      ).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter version')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Sonar project key')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Sonar project name')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Sonar token')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('https://sonar.example.com')
      ).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText('Enter Snyk token')
      ).toBeInTheDocument()
    })
  })
})
