<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AlienAvatar from '../../packages/vue/src/AlienAvatar.vue'
import { DEFAULT_COLORS } from '../../packages/vue/src/types'
import { createSeedRng, randomInt } from '../../packages/vue/src/utilities'

const seedInput = ref('Mr. Kaine')
const avatarSize = ref(120)
const isVisible = ref(false)
const gallerySeeds = ref(['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'])
const mouthSeeds = ref(['m1', 'm2', 'm3', 'm4', 'm5'])

const mouthTypes = ['small', 'smile', 'happy', 'sad', 'x'] as const

const mouthData = computed(() => {
  return mouthSeeds.value.map((seed) => {
    const rng = createSeedRng(seed)
    const typeIndex = randomInt(rng, 0, mouthTypes.length - 1)
    return {
      seed,
      type: mouthTypes[typeIndex],
      widthScale: 0.78 + rng() * 0.44,
      yOffset: randomInt(rng, -2, 2),
      tilt: randomInt(rng, -8, 8),
    }
  })
})
let galleryInterval: ReturnType<typeof setInterval> | null = null
let mouthInterval: ReturnType<typeof setInterval> | null = null

const heroSeeds = ref<string[]>([])
const copied = ref<string | null>(null)

function copyToClipboard(text: string, id: string) {
  navigator.clipboard.writeText(text)
  copied.value = id
  setTimeout(() => {
    if (copied.value === id) {
      copied.value = null
    }
  }, 2000)
}

onMounted(() => {
  const ts = Date.now()
  heroSeeds.value = Array.from({ length: 7 }, (_, i) => `hero-${ts}-${i}`)
  isVisible.value = true
  galleryInterval = setInterval(() => {
    const ts = Date.now()
    gallerySeeds.value = [
      `gallery-${ts}-1`,
      `gallery-${ts}-2`,
      `gallery-${ts}-3`,
      `gallery-${ts}-4`,
      `gallery-${ts}-5`,
      `gallery-${ts}-6`,
      `gallery-${ts}-7`,
      `gallery-${ts}-8`,
      `gallery-${ts}-9`,
      `gallery-${ts}-10`,
    ]
  }, 2000)
  mouthInterval = setInterval(() => {
    const ts = Date.now()
    mouthSeeds.value = [
      `mouth-${ts}-1`,
      `mouth-${ts}-2`,
      `mouth-${ts}-3`,
      `mouth-${ts}-4`,
      `mouth-${ts}-5`,
    ]
  }, 2000)
})

onUnmounted(() => {
  if (galleryInterval) {
    clearInterval(galleryInterval)
  }

  if (mouthInterval) {
    clearInterval(mouthInterval)
  }
})

const reactCode = `import { AlienAvatar } from '@zenon-red/alien-avatars-react'
// TypeScript-first components

function UserProfile({ user }) {
  return (
    <AlienAvatar seed={user.id} size={120} />
  )
}`

const vueCode = `import { AlienAvatar } from '@zenon-red/alien-avatars-vue'
// Vue 3 Composition API

<AlienAvatar seed="user-123" :size="120" />`

const apiProps = [
  { prop: 'seed', type: 'string', desc: 'Any string that generates the avatar' },
  { prop: 'size', type: 'number', default: '40' },
  { prop: 'colors', type: 'string[]', default: 'DEFAULT_COLORS' },
]
</script>

<template>
  <div class="h-screen overflow-y-auto snap-y snap-mandatory bg-white font-sans text-xenon-gray-100">
    <!-- Hero -->
    <section class="snap-start relative min-h-screen flex flex-col justify-center px-6 py-24 overflow-hidden">
      <div class="max-w-5xl mx-auto relative z-10 w-full">
        <div class="text-center">
          <div class="flex items-center justify-center mb-12">
            <div class="flex -space-x-6">
              <div
                v-for="(seed, index) in heroSeeds"
                :key="seed"
                class="relative group opacity-0 animate-bounce-in"
                :style="{ animationDelay: `${index * 100}ms` }"
              >
                <AlienAvatar
                  :seed="seed"
                  :size="64"
                  :colors="DEFAULT_COLORS"
                  class="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          <div
            class="mb-8 transition-all duration-700 delay-200"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <h1 class="font-display text-[clamp(3rem,8vw,5rem)] font-black tracking-tight mb-4 bg-gradient-to-br from-xenon-gray-100 via-xenon-gray-70 to-xenon-gray-100 bg-clip-text text-transparent leading-[0.9]">
              Alien Avatars
            </h1>
            <p class="text-base text-xenon-gray-70 max-w-md mx-auto leading-relaxed">
              Deterministic SVG alien avatars for React and Vue.
            </p>
          </div>

          <div
            class="flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-300"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <span class="px-4 py-2 bg-xenon-gray-10 rounded-full text-xs text-xenon-gray-70">React</span>
            <span class="px-4 py-2 bg-xenon-gray-10 rounded-full text-xs text-xenon-gray-70">Vue</span>
            <span class="px-4 py-2 bg-xenon-gray-10 rounded-full text-xs text-xenon-gray-70">SVG</span>
            <span class="px-4 py-2 bg-xenon-gray-10 rounded-full text-xs text-xenon-gray-70">Zero deps</span>
          </div>

          <div
            class="flex justify-center transition-all duration-700 delay-500"
            :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <div class="flex items-center gap-3 bg-xenon-gray-10 rounded-xl px-5 py-3 border border-xenon-gray-30">
              <code class="text-sm font-mono text-xenon-gray-70">npm install @zenon-red/alien-avatars-react</code>
              <button
                class="text-xenon-gray-60 hover:text-alien-purple transition-colors p-1.5 rounded hover:bg-white"
                :title="copied === 'hero' ? 'Copied!' : 'Copy'"
                @click="copyToClipboard('npm install @zenon-red/alien-avatars-react', 'hero')"
              >
                <svg v-if="copied !== 'hero'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700"
        :class="isVisible ? 'opacity-100' : 'opacity-0'"
      >
        <div class="w-6 h-10 border-2 border-xenon-gray-30 rounded-full flex justify-center pt-2">
          <div class="w-1 h-2 bg-xenon-gray-30 rounded-full animate-bounce" />
        </div>
      </div>
    </section>

    <!-- Playground -->
    <section id="playground" class="snap-start min-h-screen py-24 lg:py-32 px-6 flex items-center">
      <div class="max-w-5xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <h2 class="font-display text-[clamp(2rem,4vw,2.5rem)] font-bold mb-6 leading-[1.1]">
              Try it
            </h2>
            <p class="text-base text-xenon-gray-70 mb-8 leading-relaxed">
              Same seed, same avatar.
            </p>

            <div class="space-y-6">
              <div>
                <label class="text-xs text-xenon-gray-70 mb-3 block">Seed</label>
                <input
                  v-model="seedInput"
                  type="text"
                  class="w-full px-4 py-3 bg-xenon-gray-10 border border-xenon-gray-30 rounded-lg text-xenon-gray-100 placeholder:text-xenon-gray-40 focus:border-[var(--color-alien-purple)] focus:outline-none focus:ring-1 focus:ring-[var(--color-alien-purple)]/20 transition-all"
                  placeholder="Type anything..."
                >
              </div>

              <div>
                <label class="text-xs text-xenon-gray-70 mb-3 block">Size: {{ avatarSize }}px</label>
                <input
                  v-model="avatarSize"
                  type="range"
                  min="40"
                  max="200"
                  class="w-full h-2 bg-xenon-gray-30 rounded-full appearance-none cursor-pointer accent-[var(--color-alien-purple)] range-slider"
                >
              </div>
            </div>
          </div>

          <div class="min-w-0 flex flex-col items-center justify-center">
            <div class="p-6 sm:p-8 lg:p-16 w-full flex flex-col items-center justify-center min-h-[320px] lg:min-h-[400px] bg-gradient-to-br from-xenon-gray-10 to-xenon-gray-10 rounded-2xl border border-xenon-gray-30">
              <div class="relative w-[220px] h-[220px] flex items-center justify-center">
                <AlienAvatar
                  :seed="seedInput || 'preview'"
                  :size="avatarSize"
                  :colors="DEFAULT_COLORS"
                  class="absolute transition-all duration-200 drop-shadow-xl"
                />
              </div>
              <div class="mt-8 px-4 py-2 bg-white rounded-lg">
                <code class="text-xs text-xenon-gray-70 font-mono">
                  "{{ seedInput || 'preview' }}"
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Traits Section -->
    <section id="traits" class="snap-start py-24 lg:py-32 px-6 bg-xenon-gray-10">
      <div class="max-w-6xl mx-auto">
        <!-- Eyes -->
        <div class="mb-32 animate-slide-in-left [animation-timeline:view()] [animation-range:entry_0%_entry_50%]">
          <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-black mb-16 text-center leading-[0.95]">
            Eyes
          </h2>
          <div class="grid grid-cols-3 md:grid-cols-5 gap-4 lg:gap-8">
            <!-- Eye 1: Neutral -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <ellipse cx="11" cy="18" rx="5" ry="7" fill="var(--color-xenon-gray-100)" transform="rotate(-30, 11, 18)" />
                <ellipse cx="25" cy="18" rx="5" ry="7" fill="var(--color-xenon-gray-100)" transform="rotate(30, 25, 18)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Neutral</span>
            </div>
            <!-- Eye 2: Narrow -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <ellipse cx="11" cy="18" rx="3.5" ry="5.5" fill="var(--color-xenon-gray-100)" transform="rotate(-35, 11, 18)" />
                <ellipse cx="25" cy="18" rx="3.5" ry="5.5" fill="var(--color-xenon-gray-100)" transform="rotate(35, 25, 18)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Narrow</span>
            </div>
            <!-- Eye 3: Wink Left -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <path d="M8,16 L12,18 L8,20" stroke="var(--color-xenon-gray-100)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <ellipse cx="23" cy="18" rx="5" ry="7" fill="var(--color-xenon-gray-100)" transform="rotate(30, 23, 18)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Wink Left</span>
            </div>
            <!-- Eye 4: Wink Right -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <ellipse cx="13" cy="18" rx="5" ry="7" fill="var(--color-xenon-gray-100)" transform="rotate(-30, 13, 18)" />
                <path d="M28,16 L24,18 L28,20" stroke="var(--color-xenon-gray-100)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Wink Right</span>
            </div>
            <!-- Eye 5: Wide -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <ellipse cx="11" cy="18" rx="6" ry="8" fill="var(--color-xenon-gray-100)" transform="rotate(-30, 11, 18)" />
                <ellipse cx="25" cy="18" rx="6" ry="8" fill="var(--color-xenon-gray-100)" transform="rotate(30, 25, 18)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Wide</span>
            </div>
          </div>
        </div>

        <!-- Mouths -->
        <div class="mb-32 animate-slide-in-right [animation-timeline:view()] [animation-range:entry_0%_entry_50%]">
          <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-black mb-6 text-center leading-[0.95]">
            Mouths
          </h2>
          <p class="text-base text-xenon-gray-70 text-center mb-12 max-w-md mx-auto">
            Seeded morphing. Width, tilt, and position determined by the seed.
          </p>
          <div class="grid grid-cols-3 md:grid-cols-5 gap-4 lg:gap-8">
            <div
              v-for="mouth in mouthData"
              :key="mouth.seed"
              class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8 transition-all duration-500"
            >
              <svg viewBox="-2 -2 40 40" class="w-full h-full max-w-[180px]">
                <path
                  d="M35 17c0 8.5-12 17-17 17-3.5 0-17-8.5-17-17S8.611 0 18 0s17 7.611 17 17z"
                  fill="none"
                  stroke="var(--color-xenon-gray-30)"
                  stroke-width="1"
                  stroke-dasharray="2 2"
                />
                <g :transform="`translate(${18 * (1 - mouth.widthScale)} ${mouth.yOffset}) scale(${mouth.widthScale} 1) rotate(${mouth.tilt} 18 25)`">
                  <line
                    v-if="mouth.type === 'small'"
                    x1="16" y1="25" x2="20" y2="25"
                    stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round"
                  />
                  <path
                    v-else-if="mouth.type === 'smile'"
                    d="M15,25 Q18,28 21,25"
                    stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round" fill="none"
                  />
                  <path
                    v-else-if="mouth.type === 'happy'"
                    d="M14,24 c2,2 4,2 6,0"
                    stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round" fill="none"
                  />
                  <path
                    v-else-if="mouth.type === 'sad'"
                    d="M15,26 Q18,23 21,26"
                    stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round" fill="none"
                  />
                  <g v-else>
                    <line x1="16" y1="24" x2="20" y2="26" stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round" />
                    <line x1="20" y1="24" x2="16" y2="26" stroke="var(--color-xenon-gray-100)" stroke-width="1.5" stroke-linecap="round" />
                  </g>
                </g>
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4 capitalize">{{ mouth.type }}</span>
            </div>
          </div>
        </div>
        <!-- Birthmarks -->
        <div class="animate-slide-in-left [animation-timeline:view()] [animation-range:entry_0%_entry_50%]">
          <h2 class="font-display text-[clamp(2.5rem,5vw,4rem)] font-black mb-16 text-center leading-[0.95]">
            Birthmarks
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            <!-- Birthmark 1: Square -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <rect x="14" y="6" width="8" height="8" fill="none" stroke="var(--color-xenon-gray-100)" stroke-width="2" />
                <rect x="16" y="8" width="4" height="4" fill="var(--color-xenon-gray-100)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Square</span>
            </div>
            <!-- Birthmark 2: Diamond -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <rect x="17" y="5" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="17" y="7" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="15" y="9" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="17" y="9" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="19" y="9" width="2" height="2" fill="var(--color-xenon-gray-100)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Diamond</span>
            </div>
            <!-- Birthmark 3: Crown -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <rect x="15" y="6" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="19" y="6" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="13" y="8" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="15" y="8" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="17" y="8" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="19" y="8" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="21" y="8" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="17" y="10" width="2" height="2" fill="var(--color-xenon-gray-100)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Crown</span>
            </div>
            <!-- Birthmark 4: Cross -->
            <div class="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white p-4 lg:p-8">
              <svg viewBox="0 0 36 36" class="w-full h-full max-w-[180px]">
                <rect x="14" y="6" width="8" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="14" y="9" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="20" y="9" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="14" y="12" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="20" y="12" width="2" height="2" fill="var(--color-xenon-gray-100)" />
                <rect x="14" y="15" width="8" height="2" fill="var(--color-xenon-gray-100)" />
              </svg>
              <span class="text-sm text-xenon-gray-70 mt-4">Cross</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integration -->
    <section id="install" class="snap-start py-24 lg:py-32 px-2 sm:px-6">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-display text-[clamp(2rem,4vw,2.5rem)] font-bold mb-12 leading-[1.1]">
          Get started
        </h2>

        <div class="space-y-8">
          <!-- React -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                <path fill="#00bcd4" d="M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4s-12-2.59-12-4s4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6s14-2.686 14-6s-6.268-6-14-6" />
                <path fill="#00bcd4" d="M16 14a2 2 0 1 0 2 2a2 2 0 0 0-2-2" />
                <path fill="#00bcd4" d="M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493c3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.9.9 0 0 1 .458-.1m-.001-2A2.87 2.87 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124c-3.284-5.69-7.72-9.493-10.74-9.493Z" />
                <path fill="#00bcd4" d="M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393c-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369" />
              </svg>
              <span class="font-medium">React</span>
            </div>
            <div class="flex items-center gap-1.5 mb-2">
              <code class="text-sm font-mono bg-xenon-gray-10 px-3 py-2 rounded-lg max-w-[calc(100%-36px)] break-all">npm i @zenon-red/alien-avatars-react</code>
              <button
                class="text-xenon-gray-70 hover:text-[var(--color-alien-purple)] transition-colors p-1.5 rounded hover:bg-xenon-gray-10"
                :title="copied === 'react' ? 'Copied!' : 'Copy'"
                @click="copyToClipboard('npm i @zenon-red/alien-avatars-react', 'react')"
              >
                <svg v-if="copied !== 'react'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--color-success)]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
            <div class="text-sm font-mono bg-xenon-gray-10 p-3 rounded-lg whitespace-pre-wrap">
              {{ reactCode }}
            </div>
          </div>

          <!-- Vue -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#41b883" d="M1.791 3.851L12 21.471L22.209 3.936V3.85H18.24l-6.18 10.616L5.906 3.851z" />
                <path fill="#35495e" d="m5.907 3.851l6.152 10.617L18.24 3.851h-3.723L12.084 8.03L9.66 3.85z" />
              </svg>
              <span class="font-medium">Vue</span>
            </div>
            <div class="flex items-center gap-1.5 mb-2">
              <code class="text-sm font-mono bg-xenon-gray-10 px-3 py-2 rounded-lg max-w-[calc(100%-36px)] break-all">npm i @zenon-red/alien-avatars-vue</code>
              <button
                class="text-xenon-gray-70 hover:text-[var(--color-alien-purple)] transition-colors p-1.5 rounded hover:bg-xenon-gray-10"
                :title="copied === 'vue' ? 'Copied!' : 'Copy'"
                @click="copyToClipboard('npm i @zenon-red/alien-avatars-vue', 'vue')"
              >
                <svg v-if="copied !== 'vue'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--color-success)]">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>
            <div class="text-sm font-mono bg-xenon-gray-10 p-3 rounded-lg whitespace-pre-wrap">
              {{ vueCode }}
            </div>
          </div>
        </div>

        <!-- Props -->
        <div class="mt-12">
          <h3 class="text-lg font-medium mb-4">
            Props
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-xenon-gray-30">
                  <th class="text-left py-2 font-medium text-xenon-gray-70">
                    Prop
                  </th>
                  <th class="text-left py-2 font-medium text-xenon-gray-70">
                    Type
                  </th>
                  <th class="text-left py-2 font-medium text-xenon-gray-70">
                    Default
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-xenon-gray-30">
                <tr v-for="prop in apiProps" :key="prop.prop">
                  <td class="py-3 font-mono text-[var(--color-alien-purple)]">
                    {{ prop.prop }}
                  </td>
                  <td class="py-3 text-xenon-gray-70">
                    {{ prop.type }}
                  </td>
                  <td class="py-3 text-xenon-gray-70">
                    {{ prop.default || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="snap-start py-24 lg:py-32 px-6 bg-xenon-gray-10">
      <div class="max-w-5xl mx-auto">
        <h2 class="font-display text-[clamp(2rem,4vw,2.5rem)] font-bold mb-16 leading-[1.1]">
          Gallery
        </h2>

        <div class="grid grid-cols-5 gap-4 lg:gap-6">
          <div
            v-for="(seed, index) in gallerySeeds"
            :key="seed"
            class="aspect-square flex items-center justify-center rounded-xl bg-white p-3 transition-all duration-500"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <AlienAvatar :seed="seed" :size="64" :colors="DEFAULT_COLORS" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="snap-start py-12 px-6">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
        <div class="space-y-2">
          <p class="text-sm text-xenon-gray-70 font-mono">
            Designed, coded, and maintained by <AlienAvatar seed="zoe-design" :size="16" :colors="DEFAULT_COLORS" class="inline-block -mt-1 mr-1" /><a href="https://github.com/zr-zoe" class="text-xenon-gray-100 font-bold hover:underline">ZŌE</a>.
          </p>
          <p class="text-sm text-xenon-gray-70 font-mono">
            Original prompt by <AlienAvatar seed="plasma-king" :size="16" :colors="DEFAULT_COLORS" class="inline-block -mt-1 mr-1" /><a href="https://github.com/plasmaking" class="text-xenon-gray-100 font-bold hover:underline">Plasmaking</a>.
          </p>
          <p class="text-sm text-xenon-gray-70 font-mono">
            Built by aliens.
          </p>
        </div>
        <div class="flex items-center gap-6">
          <a href="https://github.com/zenon-red/alien-avatars" class="text-xenon-gray-70 hover:text-[var(--color-alien-purple)] transition-colors" title="GitHub" target="_blank" rel="noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
              <path fill="currentColor" d="M212.62 75.17A63.7 63.7 0 0 0 206.39 26A12 12 0 0 0 196 20a63.71 63.71 0 0 0-50 24h-20a63.71 63.71 0 0 0-50-24a12 12 0 0 0-10.39 6a63.7 63.7 0 0 0-6.23 49.17A61.5 61.5 0 0 0 52 104v8a60.1 60.1 0 0 0 45.76 58.28A43.66 43.66 0 0 0 92 192v4H76a20 20 0 0 1-20-20a44.05 44.05 0 0 0-44-44a12 12 0 0 0 0 24a20 20 0 0 1 20 20a44.05 44.05 0 0 0 44 44h16v12a12 12 0 0 0 24 0v-40a20 20 0 0 1 40 0v40a12 12 0 0 0 24 0v-40a43.66 43.66 0 0 0-5.76-21.72A60.1 60.1 0 0 0 220 112v-8a61.5 61.5 0 0 0-7.38-28.83M196 112a36 36 0 0 1-36 36h-48a36 36 0 0 1-36-36v-8a37.87 37.87 0 0 1 6.13-20.12a11.65 11.65 0 0 0 1.58-11.49a39.9 39.9 0 0 1-.4-27.72a39.87 39.87 0 0 1 26.41 17.8a12 12 0 0 0 10.1 5.53h32.35a12 12 0 0 0 10.11-5.53a39.84 39.84 0 0 1 26.41-17.8a39.9 39.9 0 0 1-.4 27.72a12 12 0 0 0 1.61 11.53A37.85 37.85 0 0 1 196 104Z" />
            </svg>
          </a>
          <a href="https://www.npmjs.com/org/zenon-red" class="text-xenon-gray-70 hover:text-[var(--color-alien-purple)] transition-colors" title="NPM" target="_blank" rel="noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="74" height="24" viewBox="0 0 512 165">
              <path fill="#C12127" d="M157.538 164.103h65.641v-32.82h65.642V0H157.538zM223.18 32.82H256v65.64h-32.82zM315.077 0v131.282h65.64V32.821h32.821v98.461h32.821V32.821h32.82v98.461H512V0zM0 131.282h65.641V32.821h32.82v98.461h32.821V0H0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-alien-purple);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-alien-purple);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.15s ease;
}
</style>
