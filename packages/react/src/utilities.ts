import type {
  NoisePixel,
  Slice,
} from './types'

function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703
  let h2 = 3144134277
  let h3 = 1013904242
  let h4 = 2773480762

  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)

  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0]
}

function sfc32(a: number, b: number, c: number, d: number) {
  return function next() {
    a >>>= 0
    b >>>= 0
    c >>>= 0
    d >>>= 0
    const t = (a + b) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    d = (d + 1) | 0
    const out = (t + d) | 0
    c = (c + out) | 0
    return (out >>> 0) / 4294967296
  }
}

export function createSeedRng(seed: string): () => number {
  const clean = seed.replace(/^0x/i, '')
  const parts = cyrb128(clean)
  return sfc32(parts[0], parts[1], parts[2], parts[3])
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

export function getDigit(number: number, ntn: number): number {
  return Math.floor((number / 10 ** ntn) % 10)
}

export function getUnit(hash: number, range: number, index?: number): number {
  const value = hash % range
  if (index && getDigit(hash, index) % 2 === 0) {
    return -value
  }
  return value
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function jitterHex(hexColor: string, amount: number): string {
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor
  if (hex.length !== 6) {
    return hexColor
  }

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  const scale = 1 + amount

  const rr = clamp(Math.round(r * scale), 0, 255)
  const gg = clamp(Math.round(g * scale), 0, 255)
  const bb = clamp(Math.round(b * scale), 0, 255)

  return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`
}

function relativeLuminance(hexColor: string): number {
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor
  if (hex.length !== 6) {
    return 0
  }

  const toLinear = (channel: number): number => {
    const s = channel / 255
    if (s <= 0.03928) {
      return s / 12.92
    }
    return ((s + 0.055) / 1.055) ** 2.4
  }

  const r = toLinear(Number.parseInt(hex.substring(0, 2), 16))
  const g = toLinear(Number.parseInt(hex.substring(2, 4), 16))
  const b = toLinear(Number.parseInt(hex.substring(4, 6), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrast(hexcolor: string): string {
  let hex = hexcolor
  if (hex.slice(0, 1) === '#') {
    hex = hex.slice(1)
  }

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000000' : '#FFFFFF'
}

export function generateNoiseTexture(hash: number): NoisePixel[] {
  const numDots = 12
  return Array.from({ length: numDots }, (_, i) => {
    const hash1 = (hash * (i * 7 + 1)) % 0xFFFFFF
    const hash2 = (hash * (i * 7 + 3)) % 0xFFFFFF
    const hash3 = (hash * (i * 7 + 5)) % 0xFFFFFF
    return {
      x: 3 + (hash1 % 30),
      y: 3 + (hash2 % 30),
      w: 1 + (hash3 % 3),
      h: 1 + ((hash3 + 1) % 3),
    }
  })
}

export function generateSlices(hash: number, size: number, getUnitFn: typeof getUnit): Slice[] {
  const numSlices = 5
  return Array.from({ length: numSlices }, (_, i) => {
    const sliceHash = hash * (i + 1) + 100
    return {
      y: getUnitFn(sliceHash, size, 1),
      height: Math.max(1, 1 + getUnitFn(sliceHash, 4, 2)),
      opacity: 0.2 + getUnitFn(sliceHash, 10, 3) / 20,
      rotate: -15 + getUnitFn(sliceHash, 30, 1),
    }
  })
}

export function pickColor(rng: () => number, colors: string[], used: Set<number>): string {
  if (colors.length === 0) {
    return '#000000'
  }

  let idx = randomInt(rng, 0, colors.length - 1)
  if (used.has(idx) && used.size < colors.length) {
    let attempts = 0
    while (used.has(idx) && attempts < colors.length * 2) {
      idx = randomInt(rng, 0, colors.length - 1)
      attempts++
    }
  }
  used.add(idx)
  return colors[idx]
}

export function pickContrastingColor(
  rng: () => number,
  baseColor: string,
  colors: string[],
  used: Set<number>,
  minContrast = 2,
): string {
  if (colors.length === 0) {
    return '#000000'
  }

  const indices = colors.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i)
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  let bestIdx = indices[0]
  let bestScore = -1

  for (const idx of indices) {
    if (used.has(idx) && used.size < colors.length) {
      continue
    }
    const score = contrastRatio(baseColor, colors[idx])
    if (score >= minContrast) {
      used.add(idx)
      return colors[idx]
    }
    if (score > bestScore) {
      bestScore = score
      bestIdx = idx
    }
  }

  used.add(bestIdx)
  return colors[bestIdx]
}
