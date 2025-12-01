import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from '../DashboardPage'

describe('DashboardPage', () => {
  it('renders user name and calls onGoToExplorer when CTA clicked', () => {
    const user = { first_name: 'Alex', last_name: 'Smith' }
    const onLogout = vi.fn()
    const onGoToExplorer = vi.fn()

    render(<DashboardPage user={user} onLogout={onLogout} onGoToExplorer={onGoToExplorer} />)

    expect(screen.getByText(/Welcome, Alex/i)).toBeInTheDocument()

    // Explore Now button
    const exploreBtn = screen.getByRole('button', { name: /Explore Now/i })
    fireEvent.click(exploreBtn)
    expect(onGoToExplorer).toHaveBeenCalled()

    // 'Go to Explorer' in Next step card
    const goBtn = screen.getByRole('button', { name: /Go to Explorer/i })
    fireEvent.click(goBtn)
    expect(onGoToExplorer).toHaveBeenCalled()
  })
})
