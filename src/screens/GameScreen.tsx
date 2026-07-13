import { useEffect, useRef, useState } from 'react'
import {
  PLAYER_HEIGHT,
  PLAYER_MAX_X,
  PLAYER_MIN_X,
  PLAYER_SPEED,
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
  const [playerX, setPlayerX] = useState(PLAYER_START_X)
  const heldKeys = useRef(new Set<string>())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      heldKeys.current.add(event.key)
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      heldKeys.current.delete(event.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    let lastTime = performance.now()
    let frameId: number

    const tick = (time: number) => {
      const deltaSeconds = (time - lastTime) / 1000
      lastTime = time

      let direction = 0
      if (heldKeys.current.has('ArrowLeft')) direction -= 1
      if (heldKeys.current.has('ArrowRight')) direction += 1

      if (direction !== 0) {
        setPlayerX((x) => {
          const next = x + direction * PLAYER_SPEED * deltaSeconds
          return Math.min(PLAYER_MAX_X, Math.max(PLAYER_MIN_X, next))
        })
      }

      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      cancelAnimationFrame(frameId)
    }
  }, [])

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
            left: playerX,
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
