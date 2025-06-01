import {render, screen, waitFor} from '@testing-library/react'
import Navbar from '@/components/custom/Navbar'
import * as sessionMediators from '@/lib/server/mediators/sessionMediators'
import {describe, expect, it, Mock, vi} from 'vitest'
import {BrowserRouter as Router} from 'react-router-dom'

// Mocking getSessionProfile
vi.mock('@/lib/server/mediators/sessionMediators')

describe('Navbar', () => {
  it('should display Profile link when user is logged in', async () => {
    // Mock the session profile to simulate a logged-in user
    const mockProfile = {id: '1', username: 'testuser', email: 'test@example.com'}
    ;(sessionMediators.getSessionProfile as Mock).mockResolvedValue(mockProfile)

    render(
      <Router>
        <Navbar />
      </Router>,
    )

    // Wait for the profile link to appear and ensure it's rendered correctly
    await waitFor(() => {
      const profileLink = screen.getByRole('link', {name: /Profiel/i})
      expect(profileLink).toBeInTheDocument()

      // Ensure the login link is not rendered
      const loginLink = screen.queryByRole('link', {name: /Inloggen/i})
      expect(loginLink).not.toBeInTheDocument()
    })
  })

  it('should display Login link when user is not logged in', async () => {
    // Mock the session profile to simulate no logged-in user
    ;(sessionMediators.getSessionProfile as Mock).mockResolvedValue(null)

    render(
      <Router>
        <Navbar />
      </Router>,
    )

    // Wait for the login link to appear and ensure it's rendered correctly
    await waitFor(() => {
      const loginLink = screen.getByRole('link', {name: /Inloggen/i})
      expect(loginLink).toBeInTheDocument()

      // Ensure the profile link is not rendered
      const profileLink = screen.queryByRole('link', {name: /Profiel/i})
      expect(profileLink).not.toBeInTheDocument()
    })
  })
})
