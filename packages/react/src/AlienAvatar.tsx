import type { ReactElement } from 'react'
import type {
  AlienAvatarData,
  AvatarProps,
  EyeType,
  MouthType,
} from './types'
import { useMemo } from 'react'
import {
  DEFAULT_COLORS,
  SIZE,
} from './types'
import {
  contrastRatio,
  createSeedRng,
  generateNoiseTexture,
  generateSlices,
  getContrast,
  getUnit,
  jitterHex,
  pickColor,
  pickContrastingColor,
  randomInt,
} from './utilities'

function generateStars(hash: number): AlienAvatarData['stars'] {
  const type = hash % 4
  return { type }
}

function generateHash(rng: () => number): number {
  return Math.floor(rng() * 0x100000000) >>> 0
}

function pickEffects(rng: () => number): AlienAvatarData['effects'] {
  const effects = {
    noise: rng() < 0.34,
    slices: rng() < 0.3,
    glitch: rng() < 0.22,
    stars: rng() < 0.28,
  }

  const names: Array<keyof typeof effects> = ['noise', 'slices', 'glitch', 'stars']
  let active = names.filter(name => effects[name])

  if (active.length === 0 && rng() < 0.6) {
    effects[names[randomInt(rng, 0, names.length - 1)]] = true
    active = names.filter(name => effects[name])
  }

  while (active.length > 2) {
    const idx = randomInt(rng, 0, active.length - 1)
    effects[active[idx]] = false
    active = names.filter(name => effects[name])
  }

  return effects
}

function generateAvatarData(seed: string, colors: string[]): AlienAvatarData {
  const rng = createSeedRng(seed)
  const used = new Set<number>()
  const wrapperBase = pickColor(rng, colors, used)
  const strokeBase = pickContrastingColor(rng, wrapperBase, colors, used, 2.2)

  const wrapperColor = jitterHex(wrapperBase, (rng() - 0.5) * 0.12)
  let strokeColor = jitterHex(strokeBase, (rng() - 0.5) * 0.18)
  if (contrastRatio(wrapperColor, strokeColor) < 2.2) {
    strokeColor = strokeBase
  }
  const effects = pickEffects(rng)
  const noiseHash = generateHash(rng)
  const slicesHash = generateHash(rng)
  const starsHash = generateHash(rng)
  const glitchHash = generateHash(rng)
  const eyeTypes = ['neutral', 'narrow', 'wink-left', 'wink-right'] as const
  const mouthTypes = ['small', 'smile', 'happy', 'sad', 'x'] as const

  return {
    wrapperColor,
    faceColor: getContrast(wrapperColor),
    strokeColor,
    eyeType: eyeTypes[randomInt(rng, 0, eyeTypes.length - 1)],
    mouthType: mouthTypes[randomInt(rng, 0, mouthTypes.length - 1)],
    mouthWidthScale: 0.78 + rng() * 0.44,
    mouthYOffset: randomInt(rng, -2, 2),
    mouthTilt: randomInt(rng, -8, 8),
    faceTranslateX: randomInt(rng, -4, 4),
    faceTranslateY: randomInt(rng, -3, 3),
    strokeTranslateX: randomInt(rng, -2, 2),
    strokeTranslateY: randomInt(rng, -2, 2),
    effects,
    noiseTexture: generateNoiseTexture(noiseHash),
    stars: generateStars(starsHash),
    glitchY: getUnit(glitchHash, SIZE - 4, 1),
    glitchHeight: Math.max(1, 1 + getUnit(glitchHash, 4, 2)),
    glitchWidth: Math.max(1, SIZE - 4 + getUnit(glitchHash, 8, 3)),
    slices: generateSlices(slicesHash, SIZE, getUnit),
  }
}

function PixelStar({ type, color }: { type: number, color: string }): ReactElement {
  const x = 18
  const y = 5

  const stars = [
    (
      <g key="s">
        <rect x={x - 1} y={y - 1} width={3} height={3} fill="none" stroke={color} strokeWidth={1} />
        <rect x={x} y={y} width={1} height={1} fill={color} />
      </g>
    ),
    (
      <g key="s">
        <rect x={x} y={y - 1} width={1} height={1} fill={color} />
        <rect x={x} y={y} width={1} height={1} fill={color} />
        <rect x={x - 1} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x + 1} y={y + 1} width={1} height={1} fill={color} />
      </g>
    ),
    (
      <g key="s">
        <rect x={x - 1} y={y} width={1} height={1} fill={color} />
        <rect x={x + 1} y={y} width={1} height={1} fill={color} />
        <rect x={x - 2} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x - 1} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x + 1} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x + 2} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x} y={y + 2} width={1} height={1} fill={color} />
      </g>
    ),
    (
      <g key="s">
        <rect x={x - 1} y={y} width={3} height={1} fill={color} />
        <rect x={x - 1} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x + 1} y={y + 1} width={1} height={1} fill={color} />
        <rect x={x - 1} y={y + 2} width={1} height={1} fill={color} />
        <rect x={x + 1} y={y + 2} width={1} height={1} fill={color} />
        <rect x={x - 1} y={y + 3} width={3} height={1} fill={color} />
      </g>
    ),
  ]

  return stars[type]
}

function Eyes({ type, faceColor }: { type: EyeType, faceColor: string }): ReactElement {
  const eyes: Record<EyeType, ReactElement> = {
    'neutral': (
      <>
        <ellipse cx={11} cy={15} rx={3.5} ry={5} fill={faceColor} transform="rotate(-30, 11, 15)" />
        <ellipse cx={25} cy={15} rx={3.5} ry={5} fill={faceColor} transform="rotate(30, 25, 15)" />
      </>
    ),
    'narrow': (
      <>
        <ellipse cx={11} cy={15} rx={2.5} ry={4} fill={faceColor} transform="rotate(-35, 11, 15)" />
        <ellipse cx={25} cy={15} rx={2.5} ry={4} fill={faceColor} transform="rotate(35, 25, 15)" />
      </>
    ),
    'wink-left': (
      <>
        <path
          d="M10,13 L12,15 L10,17"
          stroke={faceColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <ellipse cx={21} cy={15} rx={3.5} ry={5} fill={faceColor} transform="rotate(30, 21, 15)" />
      </>
    ),
    'wink-right': (
      <>
        <ellipse cx={15} cy={15} rx={3.5} ry={5} fill={faceColor} transform="rotate(-30, 15, 15)" />
        <path
          d="M26,13 L24,15 L26,17"
          stroke={faceColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </>
    ),
  }

  return eyes[type]
}

function Mouth({
  type,
  faceColor,
  widthScale,
  yOffset,
  tilt,
}: {
  type: MouthType
  faceColor: string
  widthScale: number
  yOffset: number
  tilt: number
}): ReactElement {
  const transform = `translate(${18 * (1 - widthScale)} ${yOffset}) scale(${widthScale} 1) rotate(${tilt} 18 25)`
  const mouths: Record<MouthType, ReactElement> = {
    small: <line x1={16} y1={25} x2={20} y2={25} stroke={faceColor} strokeWidth={1.2} strokeLinecap="round" />,
    smile: <path d="M15,25 Q18,27 21,25" stroke={faceColor} strokeWidth={1.2} strokeLinecap="round" fill="none" />,
    happy: <path d="M15,25 c2,1 4,1 6,0" stroke={faceColor} strokeWidth={1.2} strokeLinecap="round" fill="none" />,
    sad: <path d="M15,26 Q18,24 21,26" stroke={faceColor} strokeWidth={1.2} strokeLinecap="round" fill="none" />,
    x: (
      <>
        <line
          x1={16.5}
          y1={24}
          x2={19.5}
          y2={26}
          stroke={faceColor}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <line
          x1={19.5}
          y1={24}
          x2={16.5}
          y2={26}
          stroke={faceColor}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </>
    ),
  }

  return <g transform={transform}>{mouths[type]}</g>
}

export function AlienAvatar({
  seed,
  size = 40,
  colors = DEFAULT_COLORS,
  className,
}: AvatarProps): ReactElement {
  const data = useMemo(() => generateAvatarData(seed, colors), [seed, colors])

  const clipId = `alien-clip-${seed.replace(/[^a-z0-9]/gi, '-')}`

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Avatar for ${seed}`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z"
          fill={data.wrapperColor}
          stroke={data.wrapperColor}
          strokeWidth={0.5}
        />

        {data.effects.noise && (
          <g fill="#000" opacity={0.3}>
            {data.noiseTexture.map((pixel, i) => (
              <rect
                key={`noise-${i}`}
                x={pixel.x}
                y={pixel.y}
                width={pixel.w}
                height={pixel.h}
              />
            ))}
          </g>
        )}

        {data.effects.slices && (
          <g>
            {data.slices.map((slice, i) => (
              <rect
                key={`slice-${i}`}
                x={-SIZE}
                y={slice.y}
                width={SIZE * 3}
                height={slice.height}
                fill="#000"
                opacity={slice.opacity}
                transform={`rotate(${slice.rotate} ${SIZE / 2} ${slice.y})`}
              />
            ))}
          </g>
        )}

        {data.effects.glitch && (
          <rect
            x={2}
            y={data.glitchY}
            width={data.glitchWidth}
            height={data.glitchHeight}
            fill="#000"
            opacity={0.4}
          />
        )}

        <g transform={`translate(${data.faceTranslateX} ${1 + data.faceTranslateY})`}>
          {data.effects.stars && <PixelStar type={data.stars.type} color={data.faceColor} />}
          <Eyes type={data.eyeType} faceColor={data.faceColor} />
          <Mouth
            type={data.mouthType}
            faceColor={data.faceColor}
            widthScale={data.mouthWidthScale}
            yOffset={data.mouthYOffset}
            tilt={data.mouthTilt}
          />
        </g>

        <path
          d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z"
          fill="none"
          stroke={data.strokeColor}
          strokeWidth={1}
          transform={`translate(${data.strokeTranslateX - 0.5} ${data.strokeTranslateY - 0.25}) scale(0.95)`}
        />
      </g>
    </svg>
  )
}
