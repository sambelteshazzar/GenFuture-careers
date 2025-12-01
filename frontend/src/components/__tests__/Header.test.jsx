import { fireEvent, render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header component', () => {
  const user = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' }

  it('renders user name and initials', () => {
    const onLogout = vi.fn()
    const onProfileClick = vi.fn()
    render(<Header user={user} onLogout={onLogout} onProfileClick={onProfileClick} />)

    // greeting and name should appear
    expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument()
    expect(screen.getByText(user.first_name)).toBeInTheDocument()

    // initials should appear in the avatar
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('opens dropdown and calls logout', async () => {
    const onLogout = vi.fn()
    const onProfileClick = vi.fn()
    render(<Header user={user} onLogout={onLogout} onProfileClick={onProfileClick} />)

    // open dropdown by clicking the avatar which contains initials 'JD'
    const avatarText = screen.getByText('JD')
    const avatar = avatarText.closest('button')
    expect(avatar).toBeTruthy()
    fireEvent.click(avatar)

    // profile button should exist
    const profileBtn = await screen.findByText(/Profile Settings/i)
    expect(profileBtn).toBeInTheDocument()

    // click Sign Out
    const signOutBtn = screen.getByText(/Sign Out/i)
    fireEvent.click(signOutBtn)
    expect(onLogout).toHaveBeenCalled()
  })
})
