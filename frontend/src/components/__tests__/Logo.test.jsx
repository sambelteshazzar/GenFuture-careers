import React from 'react'
import { render, screen } from '@testing-library/react'
import Logo from '../Logo'

describe('Logo', () => {
  it('renders svg icon for legacy dark variant', () => {
    const { container } = render(<Logo size="medium" variant="dark" />)
    // legacy inline svg should be present for variant "dark"
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
