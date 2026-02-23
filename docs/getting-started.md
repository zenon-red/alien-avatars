# Getting Started

Alien Avatars is a deterministic SVG avatar library for React and Vue.

## Requirements

- React: `>=18.0.0`
- Vue: `>=3.3.0`

## Install

```bash
# React
npm install @zenon-red/alien-avatars-react

# Vue
npm install @zenon-red/alien-avatars-vue
```

## Basic Usage (React)

```tsx
import { AlienAvatar } from '@zenon-red/alien-avatars-react'

export function App() {
  return <AlienAvatar seed="user-42" size={80} />
}
```

## Basic Usage (Vue)

```vue
<script setup lang="ts">
import { AlienAvatar } from '@zenon-red/alien-avatars-vue'
</script>

<template>
  <AlienAvatar seed="user-42" :size="80" />
</template>
```

## Determinism

- The same `seed` and `colors` produce the same avatar.
- Changing either value changes generated traits and effects.

## Custom Palette

```tsx
<AlienAvatar
  seed="user-42"
  colors={['#00ff41', '#00d4ff', '#bcc6c2', '#ff406e', '#8b31ff']}
/>
```

Provide high-contrast palettes for better visibility.
