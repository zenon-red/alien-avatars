<script setup lang="ts">
import type {
  AlienAvatarData,
  AvatarProps,
} from './types'
import { computed } from 'vue'
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

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 40,
  colors: () => DEFAULT_COLORS,
})

function generateStars(hash: number) {
  const type = hash % 4
  return { type }
}

function generateHash(rng: () => number): number {
  return Math.floor(rng() * 0x100000000) >>> 0
}

function pickEffects(rng: () => number) {
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

const data = computed(() => generateAvatarData(props.seed, props.colors))
const clipId = computed(() => `alien-clip-${props.seed.replace(/[^a-z0-9]/gi, '-')}`)
</script>

<template>
  <svg
    :viewBox="`0 0 ${SIZE} ${SIZE}`"
    :width="size"
    :height="size"
    role="img"
    :aria-label="`Avatar for ${seed}`"
  >
    <defs>
      <clipPath :id="clipId">
        <path d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z" />
      </clipPath>
    </defs>

    <g :clip-path="`url(#${clipId})`">
      <path
        d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z"
        :fill="data.wrapperColor"
        :stroke="data.wrapperColor"
        stroke-width="0.5"
      />

      <g v-if="data.effects.noise" fill="#000" opacity="0.3">
        <rect
          v-for="(pixel, i) in data.noiseTexture"
          :key="`noise-${i}`"
          :x="pixel.x"
          :y="pixel.y"
          :width="pixel.w"
          :height="pixel.h"
        />
      </g>

      <g v-if="data.effects.slices">
        <rect
          v-for="(slice, i) in data.slices"
          :key="`slice-${i}`"
          :x="-SIZE"
          :y="slice.y"
          :width="SIZE * 3"
          :height="slice.height"
          fill="#000"
          :opacity="slice.opacity"
          :transform="`rotate(${slice.rotate} ${SIZE / 2} ${slice.y})`"
        />
      </g>

      <rect
        v-if="data.effects.glitch"
        x="2"
        :y="data.glitchY"
        :width="data.glitchWidth"
        :height="data.glitchHeight"
        fill="#000"
        opacity="0.4"
      />

      <g :transform="`translate(${data.faceTranslateX} ${1 + data.faceTranslateY})`">
        <template v-if="data.effects.stars">
          <g v-if="data.stars.type === 0">
            <rect x="17" y="4" width="3" height="3" fill="none" :stroke="data.faceColor" stroke-width="1" />
            <rect x="18" y="5" width="1" height="1" :fill="data.faceColor" />
          </g>
          <g v-else-if="data.stars.type === 1">
            <rect x="18" y="4" width="1" height="1" :fill="data.faceColor" />
            <rect x="18" y="5" width="1" height="1" :fill="data.faceColor" />
            <rect x="17" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="18" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="19" y="6" width="1" height="1" :fill="data.faceColor" />
          </g>
          <g v-else-if="data.stars.type === 2">
            <rect x="17" y="5" width="1" height="1" :fill="data.faceColor" />
            <rect x="19" y="5" width="1" height="1" :fill="data.faceColor" />
            <rect x="16" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="17" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="18" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="19" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="20" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="18" y="7" width="1" height="1" :fill="data.faceColor" />
          </g>
          <g v-else>
            <rect x="17" y="5" width="3" height="1" :fill="data.faceColor" />
            <rect x="17" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="19" y="6" width="1" height="1" :fill="data.faceColor" />
            <rect x="17" y="7" width="1" height="1" :fill="data.faceColor" />
            <rect x="19" y="7" width="1" height="1" :fill="data.faceColor" />
            <rect x="17" y="8" width="3" height="1" :fill="data.faceColor" />
          </g>
        </template>

        <template v-if="data.eyeType === 'neutral'">
          <ellipse cx="11" cy="15" rx="3.5" ry="5" :fill="data.faceColor" transform="rotate(-30, 11, 15)" />
          <ellipse cx="25" cy="15" rx="3.5" ry="5" :fill="data.faceColor" transform="rotate(30, 25, 15)" />
        </template>
        <template v-else-if="data.eyeType === 'narrow'">
          <ellipse cx="11" cy="15" rx="2.5" ry="4" :fill="data.faceColor" transform="rotate(-35, 11, 15)" />
          <ellipse cx="25" cy="15" rx="2.5" ry="4" :fill="data.faceColor" transform="rotate(35, 25, 15)" />
        </template>
        <template v-else-if="data.eyeType === 'wink-left'">
          <path
            d="M10,13 L12,15 L10,17"
            :stroke="data.faceColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
          <ellipse cx="21" cy="15" rx="3.5" ry="5" :fill="data.faceColor" transform="rotate(30, 21, 15)" />
        </template>
        <template v-else>
          <ellipse cx="15" cy="15" rx="3.5" ry="5" :fill="data.faceColor" transform="rotate(-30, 15, 15)" />
          <path
            d="M26,13 L24,15 L26,17"
            :stroke="data.faceColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </template>

        <g :transform="`translate(${18 * (1 - data.mouthWidthScale)} ${data.mouthYOffset}) scale(${data.mouthWidthScale} 1) rotate(${data.mouthTilt} 18 25)`">
          <line
            v-if="data.mouthType === 'small'"
            x1="16"
            y1="25"
            x2="20"
            y2="25"
            :stroke="data.faceColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
          <path
            v-else-if="data.mouthType === 'smile'"
            d="M15,25 Q18,27 21,25"
            :stroke="data.faceColor"
            stroke-width="1.2"
            stroke-linecap="round"
            fill="none"
          />
          <path
            v-else-if="data.mouthType === 'happy'"
            d="M15,25 c2,1 4,1 6,0"
            :stroke="data.faceColor"
            stroke-width="1.2"
            stroke-linecap="round"
            fill="none"
          />
          <path
            v-else-if="data.mouthType === 'sad'"
            d="M15,26 Q18,24 21,26"
            :stroke="data.faceColor"
            stroke-width="1.2"
            stroke-linecap="round"
            fill="none"
          />
          <g v-else>
            <line
              x1="16.5"
              y1="24"
              x2="19.5"
              y2="26"
              :stroke="data.faceColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <line
              x1="19.5"
              y1="24"
              x2="16.5"
              y2="26"
              :stroke="data.faceColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </g>
        </g>
      </g>

      <path
        d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z"
        fill="none"
        :stroke="data.strokeColor"
        stroke-width="1"
        :transform="`translate(${data.strokeTranslateX - 0.5} ${data.strokeTranslateY - 0.25}) scale(0.95)`"
      />
    </g>
  </svg>
</template>
