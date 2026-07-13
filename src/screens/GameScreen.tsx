import { useEffect, useRef, useState } from 'react'
import {
  BLOCKS,
  BUBBLE_BOUNCE_VY,
  BUBBLE_MIN_X,
  BUBBLE_SIZES,
  BUBBLE_SPLIT_VY,
  BUBBLE_START_X,
  BUBBLE_START_Y,
  BUBBLE_VX,
  CEILING_Y,
  FIXED_DELTA_SECONDS,
  FIXED_FPS,
  FLOOR_TOP_Y,
  GRAVITY,
  PLAYER_HEIGHT,
  PLAYER_INVULNERABLE_SECONDS,
  PLAYER_MAX_X,
  PLAYER_MIN_X,
  PLAYER_SPEED,
  PLAYER_START_LIVES,
  PLAYER_START_X,
  PLAYER_WIDTH,
  PLAYER_Y,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  TIME_LIMIT_SECONDS,
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
  tier: number
  vx: number
  vy: number
}

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

type GameStatus = 'playing' | 'lost' | 'won'

interface GameScreenProps {
  onExit: () => void
}

function GameScreen({ onExit }: GameScreenProps) {
  const [playerX, setPlayerX] = useState(PLAYER_START_X)
  const [lives, setLives] = useState(PLAYER_START_LIVES)
  const [hitFlash, setHitFlash] = useState(false)
  const [status, setStatus] = useState<GameStatus>('playing')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS)
  const [wires, setWires] = useState<Wire[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      id: 0,
      x: BUBBLE_START_X,
      y: BUBBLE_START_Y,
      size: BUBBLE_SIZES[0],
      tier: 0,
      vx: BUBBLE_VX,
      vy: 0,
    },
  ])
  const heldKeys = useRef(new Set<string>())
  const playerXRef = useRef(playerX)
  const wiresRef = useRef(wires)
  const bubblesRef = useRef(bubbles)
  const nextWireId = useRef(0)
  const nextBubbleId = useRef(1)
  const invulnerableSecondsLeft = useRef(0)
  const livesRef = useRef(lives)
  const statusRef = useRef(status)
  const timeLeftRef = useRef(timeLeft)

  useEffect(() => {
    playerXRef.current = playerX
  }, [playerX])

  useEffect(() => {
    livesRef.current = lives
  }, [lives])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    wiresRef.current = wires
  }, [wires])

  useEffect(() => {
    bubblesRef.current = bubbles
  }, [bubbles])

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  const restartGame = () => {
    invulnerableSecondsLeft.current = 0
    playerXRef.current = PLAYER_START_X
    livesRef.current = PLAYER_START_LIVES
    statusRef.current = 'playing'
    timeLeftRef.current = TIME_LIMIT_SECONDS

    setPlayerX(PLAYER_START_X)
    setLives(PLAYER_START_LIVES)
    setHitFlash(false)
    setStatus('playing')
    setTimeLeft(TIME_LIMIT_SECONDS)
    setWires([])
    setBubbles([
      {
        id: 0,
        x: BUBBLE_START_X,
        y: BUBBLE_START_Y,
        size: BUBBLE_SIZES[0],
        tier: 0,
        vx: BUBBLE_VX,
        vy: 0,
      },
    ])
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      heldKeys.current.add(event.key)

      if (event.key === ' ') {
        event.preventDefault()

        if (!event.repeat && statusRef.current === 'playing') {
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

    const tick = () => {
      const deltaSeconds = FIXED_DELTA_SECONDS

      if (statusRef.current !== 'playing') {
        return
      }

      const newTimeLeft = Math.max(0, timeLeftRef.current - deltaSeconds)
      timeLeftRef.current = newTimeLeft
      setTimeLeft(newTimeLeft)
      if (newTimeLeft === 0) {
        statusRef.current = 'lost'
        setStatus('lost')
      }

      let direction = 0
      if (heldKeys.current.has('ArrowLeft')) direction -= 1
      if (heldKeys.current.has('ArrowRight')) direction += 1

      let nextPlayerX = playerXRef.current
      if (direction !== 0) {
        nextPlayerX = Math.min(
          PLAYER_MAX_X,
          Math.max(
            PLAYER_MIN_X,
            playerXRef.current + direction * PLAYER_SPEED * deltaSeconds,
          ),
        )
        setPlayerX(nextPlayerX)
      }

      const movedWires = wiresRef.current
        .map((wire) => ({ ...wire, y: wire.y - WIRE_SPEED * deltaSeconds }))
        .filter((wire) => wire.y + WIRE_HEIGHT > WIRE_TOP_Y)
        .filter(
          (wire) =>
            !BLOCKS.some((block) =>
              rectsOverlap(
                wire.x,
                wire.y,
                WIRE_WIDTH,
                WIRE_HEIGHT,
                block.x,
                block.y,
                block.width,
                block.height,
              ),
            ),
        )

      const movedBubbles = bubblesRef.current.map((bubble) => {
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
        } else if (vy > 0) {
          for (const block of BLOCKS) {
            const overlapsX = x + bubble.size > block.x && x < block.x + block.width
            const wasAboveBlock = bubble.y + bubble.size <= block.y
            const landedOnBlock = y + bubble.size > block.y
            if (overlapsX && wasAboveBlock && landedOnBlock) {
              y = block.y - bubble.size
              vy = BUBBLE_BOUNCE_VY
              break
            }
          }
        }

        return { ...bubble, x, y, vx, vy }
      })

      const hitWireIds = new Set<number>()
      const nextBubbles: Bubble[] = []

      for (const bubble of movedBubbles) {
        const hitWire = movedWires.find(
          (wire) =>
            !hitWireIds.has(wire.id) &&
            rectsOverlap(
              wire.x,
              wire.y,
              WIRE_WIDTH,
              WIRE_HEIGHT,
              bubble.x,
              bubble.y,
              bubble.size,
              bubble.size,
            ),
        )

        if (!hitWire) {
          nextBubbles.push(bubble)
          continue
        }

        hitWireIds.add(hitWire.id)

        const nextTier = bubble.tier + 1
        if (nextTier < BUBBLE_SIZES.length) {
          const nextSize = BUBBLE_SIZES[nextTier]
          const centerX = bubble.x + bubble.size / 2
          const centerY = bubble.y + bubble.size / 2
          nextBubbles.push(
            {
              id: nextBubbleId.current++,
              x: centerX - nextSize / 2,
              y: centerY - nextSize / 2,
              size: nextSize,
              tier: nextTier,
              vx: -Math.abs(BUBBLE_VX),
              vy: BUBBLE_SPLIT_VY,
            },
            {
              id: nextBubbleId.current++,
              x: centerX - nextSize / 2,
              y: centerY - nextSize / 2,
              size: nextSize,
              tier: nextTier,
              vx: Math.abs(BUBBLE_VX),
              vy: BUBBLE_SPLIT_VY,
            },
          )
        }
        // 가장 작은 Bubble(다음 tier 없음)은 분할하지 않고 그대로 소멸(nextBubbles에 포함하지 않음)
      }

      setWires(movedWires.filter((wire) => !hitWireIds.has(wire.id)))
      setBubbles(nextBubbles)

      if (nextBubbles.length === 0 && statusRef.current === 'playing') {
        statusRef.current = 'won'
        setStatus('won')
      }

      if (invulnerableSecondsLeft.current > 0) {
        invulnerableSecondsLeft.current = Math.max(
          0,
          invulnerableSecondsLeft.current - deltaSeconds,
        )
      } else {
        const hitPlayer = nextBubbles.some((bubble) =>
          rectsOverlap(
            nextPlayerX,
            PLAYER_Y,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            bubble.x,
            bubble.y,
            bubble.size,
            bubble.size,
          ),
        )

        if (hitPlayer) {
          invulnerableSecondsLeft.current = PLAYER_INVULNERABLE_SECONDS
          const newLives = Math.max(0, livesRef.current - 1)
          setLives(newLives)
          setHitFlash(true)
          setTimeout(() => setHitFlash(false), 300)
          if (newLives === 0) {
            statusRef.current = 'lost'
            setStatus('lost')
          }
        }
      }
    }
    const intervalId = setInterval(tick, 1000 / FIXED_FPS)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="game-screen">
      <button type="button" className="exit-button" onClick={onExit}>
        나가기
      </button>
      <div className="lives-display" aria-label={`목숨 ${lives}개 남음`}>
        {'❤'.repeat(lives)}
        <span className="lives-empty">{'❤'.repeat(PLAYER_START_LIVES - lives)}</span>
      </div>
      <div className="timer-display">{Math.ceil(timeLeft)}초</div>
      {status !== 'playing' && (
        <div className="status-banner">
          <p className={`status-banner-text ${status}`}>
            {status === 'won' ? '성공' : '실패'}
          </p>
          <div className="status-banner-actions">
            <button type="button" onClick={restartGame}>
              다시 시작
            </button>
            <button type="button" onClick={onExit}>
              메인으로
            </button>
          </div>
        </div>
      )}
      <div
        className="game-stage"
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
      >
        <div className="floor" />
        {BLOCKS.map((block, index) => (
          <div
            key={index}
            className="block"
            style={{
              left: block.x,
              top: block.y,
              width: block.width,
              height: block.height,
            }}
          />
        ))}
        <div
          className={hitFlash ? 'player hit' : 'player'}
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
