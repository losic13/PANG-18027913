export const STAGE_WIDTH = 800
export const STAGE_HEIGHT = 600

export const WALL_THICKNESS = 8
export const FLOOR_HEIGHT = 16

export const PLAYER_WIDTH = 40
export const PLAYER_HEIGHT = 40
export const PLAYER_Y = STAGE_HEIGHT - FLOOR_HEIGHT - PLAYER_HEIGHT

export const PLAYER_MIN_X = WALL_THICKNESS
export const PLAYER_MAX_X = STAGE_WIDTH - WALL_THICKNESS - PLAYER_WIDTH
export const PLAYER_START_X = (STAGE_WIDTH - PLAYER_WIDTH) / 2

export const PLAYER_SPEED = 300 // px per second

export const WIRE_WIDTH = 4
export const WIRE_HEIGHT = 16
export const WIRE_SPEED = 500 // px per second
export const WIRE_TOP_Y = WALL_THICKNESS

export const GRAVITY = 800 // px per second^2

export const BIG_BUBBLE_SIZE = 80
export const MEDIUM_BUBBLE_SIZE = 56
export const SMALL_BUBBLE_SIZE = 32
export const BUBBLE_SIZES = [BIG_BUBBLE_SIZE, MEDIUM_BUBBLE_SIZE, SMALL_BUBBLE_SIZE]

export const BUBBLE_START_X = STAGE_WIDTH / 2 - BIG_BUBBLE_SIZE / 2
export const BUBBLE_START_Y = 80
export const BUBBLE_VX = 200 // px per second
export const BUBBLE_BOUNCE_VY = -700 // px per second, 바닥에 튕길 때마다 부여되는 고정 속도(항상 같은 높이로 재상승)
export const BUBBLE_SPLIT_VY = -500 // px per second, 분할 직후 위로 튀어 오르는 속도

export const FLOOR_TOP_Y = STAGE_HEIGHT - FLOOR_HEIGHT
export const BUBBLE_MIN_X = WALL_THICKNESS
export const CEILING_Y = WALL_THICKNESS

export const PLAYER_START_LIVES = 3
export const PLAYER_INVULNERABLE_SECONDS = 1

export const TIME_LIMIT_SECONDS = 99
