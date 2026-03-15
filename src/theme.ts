import { createTheme, type Theme } from '@mui/material/styles'

export function buildTheme(dark: boolean): Theme {
  return createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
      primary: {
        main: dark ? '#64b5f6' : '#0050a0',
      },
      secondary: {
        main: dark ? '#ce93d8' : '#7b1fa2',
      },
      background: {
        default: dark ? '#0d1117' : '#f0f4f8',
        paper: dark ? '#161b22' : '#ffffff',
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
              ? '1px solid rgba(48, 54, 61, 0.8)'
              : '1px solid rgba(0, 80, 160, 0.12)',
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
