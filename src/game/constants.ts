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
