---
name: alien-avatars
description: Generate unique SVG alien avatars from any seed string. Use when working with @zenon-red/alien-avatars-react or @zenon-red/alien-avatars-vue packages.
---

# Alien Avatars

Cross-framework avatar generation library for React and Vue 3.

## Packages

| Package | Framework | Export |
|---------|-----------|--------|
| `@zenon-red/alien-avatars-react` | React 18+ | `AlienAvatar` component |
| `@zenon-red/alien-avatars-vue` | Vue 3.3+ | `AlienAvatar` component |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | `string` | required | Seed string for deterministic generation |
| `size` | `number` | `40` | Avatar size in pixels |
| `colors` | `string[]` | `DEFAULT_COLORS` | Color palette override (5 colors) |

## Usage

### React

```tsx
import { AlienAvatar } from '@zenon-red/alien-avatars-react'

function App() {
  return <AlienAvatar seed="user-123" size={80} />
}
```

### Vue

```vue
<script setup>
import { AlienAvatar } from '@zenon-red/alien-avatars-vue'
</script>

<template>
  <AlienAvatar seed="user-123" :size="80" />
</template>
```

## Color Palette

Default palette (5 colors):

```ts
const DEFAULT_COLORS = [
  '#00ff41',
  '#00d4ff',
  '#BCC6C2',
  '#ff406e',
  '#8b31ff',
]
```

Override with custom palette:

```tsx
<AlienAvatar
  seed="user-123"
  colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
/>
```

## Development

```bash
bun install                # Install dependencies
bun run lint               # Lint repository
bun run build              # Build all packages
bun run dev                # Watch mode
bun run --filter site dev  # Run demo site
```

## Release Checklist

Before publishing:

- [ ] `bun run lint` passes
- [ ] `bun run build` passes
- [ ] README links and install snippets are correct
- [ ] Package exports and peer dependency ranges are correct

## Project Structure

```
alien-avatars/
├── packages/
│   ├── react/     # @zenon-red/alien-avatars-react
│   └── vue/       # @zenon-red/alien-avatars-vue
├── site/          # Vue 3 showcase + playground
├── docs/          # Documentation
└── skills/        # Agent guidance
```

## Features

- **Deterministic**: Same seed always generates identical avatar
- **Lightweight**: ~2KB gzipped per package
- **Zero dependencies**: Core generation has no external deps
- **TypeScript**: Full type declarations included
- **Tree-shakeable**: ESM/CJS dual exports
