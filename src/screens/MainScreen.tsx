import { useState } from 'react'
import './MainScreen.css'

interface GameOption {
  id: string
  name: string
}

const GAME_OPTIONS: GameOption[] = [{ id: 'mission1', name: '미션 1' }]

interface MainScreenProps {
  onStart: (gameId: string) => void
}

function MainScreen({ onStart }: MainScreenProps) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  return (
    <div className="main-screen">
      <h1 className="main-screen-title">PANG</h1>
      <ul className="game-select-list">
        {GAME_OPTIONS.map((game) => (
          <li key={game.id}>
            <button
              type="button"
              className={
                game.id === selectedGameId
                  ? 'game-select-item selected'
                  : 'game-select-item'
              }
              onClick={() => setSelectedGameId(game.id)}
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="start-button"
        disabled={selectedGameId === null}
        onClick={() => selectedGameId && onStart(selectedGameId)}
      >
        시작
      </button>
    </div>
  )
}

export default MainScreen
