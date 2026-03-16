import { createTheme, type Theme } from '@mui/material/styles'
import { COLOR_SCHEMES } from './data/colorSchemes'
import { hexToRgb } from './utils/color'

/** Blend a tiny fraction of the accent color into a base color */
function tint(base: [number, number, number], accent: [number, number, number], amount: number): string {
  const r = Math.round(base[0] + (accent[0] - base[0]) * amount)
  const g = Math.round(base[1] + (accent[1] - base[1]) * amount)
  const b = Math.round(base[2] + (accent[2] - base[2]) * amount)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function buildTheme(dark: boolean, schemeIndex = 0): Theme {
  const scheme = COLOR_SCHEMES[schemeIndex] ?? COLOR_SCHEMES[0]
  const primary = dark ? scheme.primary.dark : scheme.primary.light
  const secondary = dark ? scheme.secondary.dark : scheme.secondary.light
  const accentRgb = hexToRgb(primary)

  // Subtly tint backgrounds with the accent color
  const bgDefault = dark
    ? tint([13, 17, 23], accentRgb, 0.06)
    : tint([240, 244, 248], accentRgb, 0.04)
  const bgPaper = dark
    ? tint([22, 27, 34], accentRgb, 0.05)
    : tint([255, 255, 255], accentRgb, 0.02)

  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: { main: primary },
      secondary: { main: secondary },
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      text: {
        primary: dark ? '#e6edf3' : '#0a1929',
        secondary: dark ? '#8b949e' : '#4a6080',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: dark
              ? `1px solid rgba(${accentRgb}, 0.12)`
              : `1px solid rgba(${accentRgb}, 0.10)`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  })
}
