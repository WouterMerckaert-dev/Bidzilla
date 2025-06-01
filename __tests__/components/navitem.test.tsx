import {render, screen} from '@testing-library/react'
import NavItem from '../../src/components/custom/navitem'
import {describe, expect, it} from 'vitest'
import {BrowserRouter as Router} from 'react-router-dom'
import {Home} from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip' // Zorg ervoor dat Tooltip wordt geïmporteerd

describe('NavItem', () => {
  it('should render collapsed link with tooltip', () => {
    render(
      <Router>
        {/* Zorg ervoor dat de Tooltip.Provider om de component heen gewikkeld is */}
        <Tooltip.Provider>
          <NavItem isCollapsed={true} Icon={Home} title="Home" path="/" />
        </Tooltip.Provider>
      </Router>,
    )

    // Controleer of de Tooltip zichtbaar is en of de juiste tekst zichtbaar is in het sr-only element
    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument() // Dit zou het sr-only span moeten vinden
  })

  it('should render full link without tooltip', () => {
    render(
      <Router>
        <NavItem isCollapsed={false} Icon={Home} title="Home" path="/" />
      </Router>,
    )

    // Controleer of de volledige link zonder tooltip zichtbaar is
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.queryByRole('tooltip')).toBeNull() // Zorg ervoor dat er geen tooltip wordt weergegeven
  })

  it('should render the correct icon', () => {
    render(
      <Router>
        <Tooltip.Provider>
          <NavItem isCollapsed={true} Icon={Home} title="Home" path="/" />
        </Tooltip.Provider>
      </Router>,
    )

    // Controleer of het juiste pictogram is gerenderd
    expect(screen.getByRole('link').querySelector('svg')).not.toBeNull()
  })
})
