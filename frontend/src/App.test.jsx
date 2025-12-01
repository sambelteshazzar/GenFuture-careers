import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders loading state initially', () => {
    render(<App />)

    // app should render and show at least one brand/text node
    const matches = screen.getAllByText(/GenFuture Career/i)
    expect(matches.length).toBeGreaterThan(0)
  })
})
