# API Reference

## React Package

Import from `@zenon-red/alien-avatars-react`.

### `AlienAvatar`

Props:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `seed` | `string` | required | Deterministic seed source |
| `size` | `number` | `40` | Rendered width and height in pixels |
| `colors` | `string[]` | `DEFAULT_COLORS` | Palette used to generate face/stroke colors |
| `className` | `string` | `undefined` | Optional class for the root `<svg>` |

Exports:

- `AlienAvatar`
- `DEFAULT_COLORS`
- `SIZE`
- Types: `AvatarProps`, `EyeType`, `MouthType`

## Vue Package

Import from `@zenon-red/alien-avatars-vue`.

### `<AlienAvatar />`

Props:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `seed` | `string` | required | Deterministic seed source |
| `size` | `number` | `40` | Rendered width and height in pixels |
| `colors` | `string[]` | `DEFAULT_COLORS` | Palette used to generate face/stroke colors |

Additional attributes like `class`, `style`, and ARIA attributes pass through to the root `<svg>`.

Exports:

- `AlienAvatar`
- `DEFAULT_COLORS`
- `SIZE`
- Types: `AvatarProps`, `EyeType`, `MouthType`

## Shared Constants

```ts
export const DEFAULT_COLORS = [
  '#00ff41',
  '#00d4ff',
  '#BCC6C2',
  '#ff406e',
  '#8b31ff',
]

export const SIZE = 36
```
