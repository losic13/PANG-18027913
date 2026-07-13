import {
  PLAYER_HEIGHT,
  PLAYER_START_X,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from '../game/constants'
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
      <div
        className="game-stage"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
      >
        <div className="floor" />
        <div
          className="player"
          style={{
            left: PLAYER_START_X,
            top: PLAYER_Y,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
          }}
        />
      </div>
    </div>
  )
}

export default GameScreen
