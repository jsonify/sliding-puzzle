import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import renderWithProviders from '../testUtils'

describe('<App />', () => {
  it('renders level select screen initially', () => {
    renderWithProviders(<App />, false)
    expect(screen.getByText('Sliding Puzzle')).toBeInTheDocument()
    expect(screen.getByText('Select Grid Size')).toBeInTheDocument()
    expect(screen.getByText('Select Difficulty')).toBeInTheDocument()
  })

  it('starts game when clicking start game', async () => {
    renderWithProviders(<App />, false)
    const user = userEvent.setup()

    // Click start game
    await user.click(screen.getByText('Start Game'))

    // Verify game UI is rendered
    expect(screen.getByText('Moves:')).toBeInTheDocument()
    expect(screen.getByText('Time:')).toBeInTheDocument()
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })
})
