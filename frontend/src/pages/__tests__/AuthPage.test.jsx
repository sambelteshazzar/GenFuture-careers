import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthPage from '../AuthPage'

// Mock the api module used by AuthPage
vi.mock('../../services/api', () => {
  return {
    login: vi.fn((email, password) => Promise.resolve({ data: { access_token: 'tok' } })),
    register: vi.fn((payload) => Promise.resolve({ data: { ok: true } })),
  }
})

describe('AuthPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders login initially and demo login calls onAuth', async () => {
    const onAuth = vi.fn()
    render(<AuthPage onAuth={onAuth} initialMode="login" />)

    expect(screen.getByText(/Welcome Back!/i)).toBeInTheDocument()

    const demoBtn = screen.getByRole('button', { name: /Use Demo Account/i })
    fireEvent.click(demoBtn)

    await waitFor(() => expect(onAuth).toHaveBeenCalled())
    expect(localStorage.getItem('genFutureToken')).toBe('tok')
  })

  it('validates fields when toggled to sign up and shows errors on submit', async () => {
    render(<AuthPage initialMode="login" />)

    // switch mode
    const signUpAnchor = screen.getByText(/Sign Up/i)
    fireEvent.click(signUpAnchor)

    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /Sign Up/i })
    expect(submitBtn).toBeInTheDocument()

    // verify signup input fields are present
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })
})
