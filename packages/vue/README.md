# @zenon-red/alien-avatars-vue

Deterministic SVG alien avatars for Vue 3. Generate unique, consistent avatars from any string (username, email, ID).

## Installation

```bash
npm install @zenon-red/alien-avatars-vue
# or
bun add @zenon-red/alien-avatars-vue
# or
pnpm add @zenon-red/alien-avatars-vue
```

## Usage

```vue
<script setup>
import { AlienAvatar } from '@zenon-red/alien-avatars-vue'
</script>

<template>
  <div>
    <AlienAvatar :seed="user.username" :size="64" />
    <span>{{ user.username }}</span>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | `string` | **required** | The seed string (username, email, ID) used to generate the avatar |
| `size` | `number` | `40` | Width and height in pixels |
| `colors` | `string[]` | See below | Custom color palette |

## Custom Colors

```vue
<script setup>
import { AlienAvatar, DEFAULT_COLORS } from '@zenon-red/alien-avatars-vue'

const myColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
</script>

<template>
  <AlienAvatar seed="user123" :colors="myColors" />
</template>
```

Default colors:
```ts
['#FFB8D0', '#D4A5A5', '#9B9B9B', '#9C89B8', '#6B5B95', '#88B04B', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#82E0AA', '#F1948A']
```

## Features

- **Deterministic** - Same seed = Same avatar, always
- **Zero dependencies** (peer dependency: Vue >=3.3)
- **Lightweight** - SVG-based, no external assets
- **Random effects** - Noise, slices, glitch, stars (seed-based)
- **Accessible** - Includes `aria-label` and `role="img"`
- **Vue 3** - Composition API with `<script setup>`

## Examples

### Basic usage
```vue
<AlienAvatar seed="alice" />
```

### Larger size
```vue
<AlienAvatar seed="bob@example.com" :size="128" />
```

### With Tailwind classes
```vue
<AlienAvatar seed="charlie" class="rounded-full border-2 border-gray-200" />
```

## TypeScript

Full TypeScript support included:

```ts
import { AlienAvatar, AvatarProps } from '@zenon-red/alien-avatars-vue'
```

## License

MIT © [zenon-red](https://github.com/zenon-red/alien-avatars)
