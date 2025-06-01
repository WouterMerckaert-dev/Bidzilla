import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Button} from '@/components/ui/button'
import '@testing-library/jest-dom' // Import jest-dom matchers

describe('Button Component', () => {
  it('renders button with default variant', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', {name: /click me/i})
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button', {name: /secondary/i})
    expect(button).toHaveClass('bg-secondary')
  })

  it('renders disabled button', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', {name: /disabled/i})
    expect(button).toBeDisabled()
    // Check for the specific class applied when disabled
    expect(button).toHaveClass('disabled:opacity-50')
  })
})
