import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders trademark & links', () => {
    render(<Footer />)

    // ensure the legal/trademark text exists and an about/privacy link is present
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
    const about = screen.getByText(/About/i)
    expect(about).toBeInTheDocument()
  })
})
