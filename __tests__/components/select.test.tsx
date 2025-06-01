import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {Select, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectContent} from '@/components/ui/select'
import {expect, test} from 'vitest'

test('renders the select component and opens options', async () => {
  render(
    <Select>
      <SelectTrigger>
        <span>Select an option</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Options</SelectLabel>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>,
  )

  // Trigger the select dropdown to open
  fireEvent.click(screen.getByRole('combobox'))

  // Wait for the options to appear
  await waitFor(() => {
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })
})
