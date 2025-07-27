import { render, screen } from '@testing-library/react'
import { SearchButton } from '../SearchButton'

// Mock react-dom's useFormStatus
vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: false }),
}))

describe('SearchButton', () => {
  it('renders with default text', () => {
    render(<SearchButton />)
    expect(screen.getByRole('button')).toHaveTextContent('Search')
  })

  it('renders with custom children', () => {
    render(<SearchButton>Find Items</SearchButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Find Items')
  })

  it('shows loading state when pending', () => {
    vi.mocked(require('react-dom').useFormStatus).mockReturnValue({ pending: true })
    
    render(<SearchButton />)
    expect(screen.getByRole('button')).toHaveTextContent('Searching...')
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has correct accessibility attributes', () => {
    render(<SearchButton />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('applies custom className', () => {
    render(<SearchButton className="custom-class" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})