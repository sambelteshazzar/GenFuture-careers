import React from 'react'
import { render, screen } from '@testing-library/react'
import Logo from '../Logo'

describe('Logo', () => {
  it('renders brand text when size=medium', () => {
    render(<Logo size="medium" variant="dark" />)
    expect(screen.getByText(/GenFuture Career/i)).toBeInTheDocument()
  })
})
