import {describe, it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {Input} from '@/components/ui/input'
import '@testing-library/jest-dom'

describe('Input Component', () => {
  it('renders input with default props', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-input')
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, {target: {value: 'test'}})
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })
})
