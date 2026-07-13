import './GameScreen.css'

interface GameScreenProps {
  onExit: () => void
}

function GameScreen({ onExit }: GameScreenProps) {
  return (
    <div className="game-screen">
      <button type="button" className="exit-button" onClick={onExit}>
        나가기
      </button>
    </div>
  )
}

export default GameScreen
