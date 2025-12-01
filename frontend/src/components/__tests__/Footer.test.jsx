import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders trademark & links', () => {
    render(<Footer />)

    expect(screen.getByText(/GenFuture/i)).toBeInTheDocument()
    // footer should contain link to privacy/about via hash
    const about = screen.getByText(/about/i)
    expect(about).toBeInTheDocument()
  })
})
