# @zenon-red/alien-avatars-react

Deterministic SVG alien avatars for React. Generate unique, consistent avatars from any string (username, email, ID).

## Installation

```bash
npm install @zenon-red/alien-avatars-react
# or
bun add @zenon-red/alien-avatars-react
# or
pnpm add @zenon-red/alien-avatars-react
```

## Usage

```tsx
import { AlienAvatar } from '@zenon-red/alien-avatars-react'

function Profile({ user }) {
  return (
    <div>
      <AlienAvatar seed={user.username} size={64} />
      <span>{user.username}</span>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seed` | `string` | **required** | The seed string (username, email, ID) used to generate the avatar |
| `size` | `number` | `40` | Width and height in pixels |
| `colors` | `string[]` | See below | Custom color palette |
| `className` | `string` | - | Additional CSS class |

## Custom Colors

```tsx
import { AlienAvatar, DEFAULT_COLORS } from '@zenon-red/alien-avatars-react'

<AlienAvatar
  seed="user123"
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']}
/>
```

Default colors:
```ts
['#FFB8D0', '#D4A5A5', '#9B9B9B', '#9C89B8', '#6B5B95', '#88B04B', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B500', '#82E0AA', '#F1948A']
```

## Features

- **Deterministic** - Same seed = Same avatar, always
- **Zero dependencies** (peer dependency: React >=19)
- **Lightweight** - SVG-based, no external assets
- **Random effects** - Noise, slices, glitch, stars (seed-based)
- **Accessible** - Includes `aria-label` and `role="img"`

## Examples

### Basic usage
```tsx
<AlienAvatar seed="alice" />
```

### Larger size
```tsx
<AlienAvatar seed="bob@example.com" size={128} />
```

### With custom class
```tsx
<AlienAvatar seed="charlie" className="rounded-full border-2 border-gray-200" />
```

## TypeScript

Full TypeScript support included:

```tsx
import { AlienAvatar, AvatarProps, EyeType, MouthType } from '@zenon-red/alien-avatars-react'
```

## License

MIT © [zenon-red](https://github.com/zenon-red/alien-avatars)
