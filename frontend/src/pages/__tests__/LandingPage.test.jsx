import { render, screen, fireEvent } from '@testing-library/react'
import LandingPage from '../LandingPage'

describe('LandingPage', () => {
  it('renders core hero content and Get Started triggers callback', () => {
    const onGetStarted = vi.fn()
    render(<LandingPage onGetStarted={onGetStarted} />)

    // hero title
    expect(screen.getByText(/We Provide Intelligent Career Planning/i)).toBeInTheDocument()

    // get started button
    const getStarted = screen.getByText(/Get Started/i)
    expect(getStarted).toBeInTheDocument()
    fireEvent.click(getStarted)
    expect(onGetStarted).toHaveBeenCalled()
  })
})
