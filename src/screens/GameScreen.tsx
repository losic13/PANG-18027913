import { useEffect, useRef, useState } from 'react'
import {
  BIG_BUBBLE_SIZE,
  BUBBLE_BOUNCE_VY,
  BUBBLE_MIN_X,
  BUBBLE_START_X,
  BUBBLE_START_Y,
  BUBBLE_VX,
  CEILING_Y,
  FLOOR_TOP_Y,
  GRAVITY,
  PLAYER_HEIGHT,
  PLAYER_MAX_X,
  PLAYER_MIN_X,
  PLAYER_SPEED,
  PLAYER_START_X,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  WALL_THICKNESS,
  WIRE_HEIGHT,
  WIRE_SPEED,
  WIRE_TOP_Y,
  WIRE_WIDTH,
} from '../game/constants'
import './GameScreen.css'

interface Wire {
  id: number
  x: number
  y: number
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  vx: number
  vy: number
}

interface GameScreenProps {
  onExit: () => void
}

function GameScreen({ onExit }: GameScreenProps) {
  const [playerX, setPlayerX] = useState(PLAYER_START_X)
  const [wires, setWires] = useState<Wire[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      id: 0,
      x: BUBBLE_START_X,
      y: BUBBLE_START_Y,
      size: BIG_BUBBLE_SIZE,
      vx: BUBBLE_VX,
      vy: 0,
    },
  ])
  const heldKeys = useRef(new Set<string>())
  const playerXRef = useRef(playerX)
  const nextWireId = useRef(0)

  useEffect(() => {
    playerXRef.current = playerX
  }, [playerX])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      heldKeys.current.add(event.key)

      if (event.key === ' ') {
        event.preventDefault()

        if (!event.repeat) {
          setWires((prev) => {
            if (prev.length > 0) return prev
            const wireX =
              playerXRef.current + PLAYER_WIDTH / 2 - WIRE_WIDTH / 2
            return [...prev, { id: nextWireId.current++, x: wireX, y: PLAYER_Y }]
          })
        }
      }
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

      setWires((prev) =>
        prev
          .map((wire) => ({ ...wire, y: wire.y - WIRE_SPEED * deltaSeconds }))
          .filter((wire) => wire.y + WIRE_HEIGHT > WIRE_TOP_Y),
      )

      setBubbles((prev) =>
        prev.map((bubble) => {
          let vx = bubble.vx
          let vy = bubble.vy + GRAVITY * deltaSeconds
          let x = bubble.x + vx * deltaSeconds
          let y = bubble.y + vy * deltaSeconds
          const maxX = STAGE_WIDTH - WALL_THICKNESS - bubble.size

          if (x < BUBBLE_MIN_X) {
            x = BUBBLE_MIN_X
            vx = -vx
          } else if (x > maxX) {
            x = maxX
            vx = -vx
          }

          if (y < CEILING_Y) {
            y = CEILING_Y
            vy = -vy
          } else if (y + bubble.size > FLOOR_TOP_Y) {
            y = FLOOR_TOP_Y - bubble.size
            vy = BUBBLE_BOUNCE_VY
          }

          return { ...bubble, x, y, vx, vy }
        }),
      )

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
        {wires.map((wire) => (
          <div
            key={wire.id}
            className="wire"
            style={{
              left: wire.x,
              top: wire.y,
              width: WIRE_WIDTH,
              height: WIRE_HEIGHT,
            }}
          />
        ))}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default GameScreen
