export interface AvatarProps {
  seed: string
  size?: number
  colors?: string[]
}

export type EyeType = 'neutral' | 'narrow' | 'wink-left' | 'wink-right'
export type MouthType = 'small' | 'smile' | 'happy' | 'sad' | 'x'

export interface NoisePixel {
  x: number
  y: number
  w: number
  h: number
}

export interface Slice {
  y: number
  height: number
  opacity: number
  rotate: number
}

export interface AlienAvatarData {
  wrapperColor: string
  faceColor: string
  strokeColor: string
  eyeType: EyeType
  mouthType: MouthType
  mouthWidthScale: number
  mouthYOffset: number
  mouthTilt: number
  faceTranslateX: number
  faceTranslateY: number
  strokeTranslateX: number
  strokeTranslateY: number
  effects: {
    noise: boolean
    glitch: boolean
    slices: boolean
    stars: boolean
  }
  noiseTexture: NoisePixel[]
  stars: { type: number }
  glitchY: number
  glitchHeight: number
  glitchWidth: number
  slices: Slice[]
}

export const DEFAULT_COLORS = [
  '#00ff41',
  '#00d4ff',
  '#BCC6C2',
  '#ff406e',
  '#8b31ff',
]

export const SIZE = 36
