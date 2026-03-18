import { useMemo, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import { buildTheme } from './theme'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { COLOR_SCHEMES } from './data/colorSchemes'
import { hexToRgb } from './utils/color'
import SettingsPanel from './components/SettingsPanel'
import Header from './components/Header'
import Summary from './components/Summary'
import Experience from './components/Experience'
import OpenSource from './components/OpenSource'
import Skills from './components/Skills'
import Education from './components/Education'
import WaveEffect from './components/effects/WaveEffect'
import ParticleCanvas from './components/effects/ParticleCanvas'

function tintHex(base: [number, number, number], accent: [number, number, number], amount: number): string {
  const r = Math.round(base[0] + (accent[0] - base[0]) * amount)
  const g = Math.round(base[1] + (accent[1] - base[1]) * amount)
  const b = Math.round(base[2] + (accent[2] - base[2]) * amount)
  return `${r},${g},${b}`
}

// Register CSS custom properties as <color> so browsers can interpolate them
const COLOR_PROPS = [
  '--theme-primary',
  '--theme-secondary',
  '--theme-text',
  '--theme-text-secondary',
]
let propsRegistered = false
function registerColorProps() {
  if (propsRegistered) return
  propsRegistered = true
  for (const prop of COLOR_PROPS) {
    try {
      CSS.registerProperty({
        name: prop,
        syntax: '<color>',
        inherits: true,
        initialValue: '#000000',
      })
    } catch { /* already registered or unsupported */ }
  }
}

function ResumeContent() {
  const { settings } = useSettings()
  const theme = useMemo(() => buildTheme(settings.darkMode, settings.colorScheme), [settings.darkMode, settings.colorScheme])

  const scheme = COLOR_SCHEMES[settings.colorScheme] ?? COLOR_SCHEMES[0]
  const isDark = settings.darkMode
  const primary = isDark ? scheme.primary.dark : scheme.primary.light
  const secondary = isDark ? scheme.secondary.dark : scheme.secondary.light
  const pAccent = hexToRgb(primary)
  const accentRgb = pAccent

  // Register @property once so browsers can interpolate CSS color vars
  useEffect(registerColorProps, [])

  // Push theme colors into CSS custom properties so transitions work
  useEffect(() => {
    const s = document.documentElement.style
    s.setProperty('--theme-primary', primary)
    s.setProperty('--theme-secondary', secondary)
    s.setProperty('--theme-primary-rgb', `${accentRgb[0]},${accentRgb[1]},${accentRgb[2]}`)
    s.setProperty('--theme-text', isDark ? '#e6edf3' : '#0a1929')
    s.setProperty('--theme-text-secondary', isDark ? '#8b949e' : '#4a6080')
    const bgDef = tintHex([13, 17, 23], accentRgb, isDark ? 0.06 : 0)
    const bgDefLight = tintHex([240, 244, 248], accentRgb, isDark ? 0 : 0.04)
    s.setProperty('--theme-bg', isDark ? `rgb(${bgDef})` : `rgb(${bgDefLight})`)
    const bgPaper = tintHex([22, 27, 34], accentRgb, isDark ? 0.05 : 0)
    const bgPaperLight = tintHex([255, 255, 255], accentRgb, isDark ? 0 : 0.02)
    s.setProperty('--theme-bg-paper', isDark ? `rgb(${bgPaper})` : `rgb(${bgPaperLight})`)
    s.setProperty('--theme-accent-rgb', `${accentRgb[0]},${accentRgb[1]},${accentRgb[2]}`)
  }, [primary, secondary, isDark, accentRgb])

  const pulsateKeyframes = `
    @keyframes pulsateText {
      0%, 100% { opacity: 1; text-shadow: none; }
      50% {
        opacity: 0.85;
        text-shadow: 0 0 12px rgba(${pAccent},${settings.darkMode ? 0.6 : 0.4});
      }
    }
    @keyframes waveColor {
      0%   { background-position: 200% 50%; }
      100% { background-position: 0% 50%; }
    }
  `

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*, *::before, *::after': { boxSizing: 'border-box' },
          ':root': {
            transition: '--theme-primary 0.5s ease, --theme-secondary 0.5s ease, --theme-text 0.5s ease, --theme-text-secondary 0.5s ease',
          },
          // Override MUI resolved colors with CSS vars so transitions work
          '.MuiTypography-root, .MuiSvgIcon-root, .MuiChip-root, .MuiCard-root, .MuiCardContent-root, body': {
            transition: 'color 0.5s ease, background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, fill 0.5s ease !important',
          },
          // Primary-colored text and icons
          '.MuiTypography-colorPrimary, .MuiSvgIcon-colorPrimary': {
            color: 'var(--theme-primary) !important',
          },
          '.MuiTypography-colorSecondary, .MuiSvgIcon-colorSecondary': {
            color: 'var(--theme-secondary) !important',
          },
          // Chip outlines
          '.MuiChip-outlinedPrimary': {
            color: 'var(--theme-primary) !important',
            borderColor: 'var(--theme-primary) !important',
          },
          '.MuiChip-outlinedSecondary': {
            color: 'var(--theme-secondary) !important',
            borderColor: 'var(--theme-secondary) !important',
          },
          // Section title icons and text that use primary color
          '.section-icon': {
            color: 'var(--theme-primary) !important',
            fill: 'var(--theme-primary) !important',
          },
          ...(settings.pulsate && {
            '.pulsate-text': {
              animation: 'pulsateText 4s ease-in-out infinite',
            },
          }),
        }}
      />
      {settings.pulsate && (
        <GlobalStyles styles={pulsateKeyframes} />
      )}

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'background-color 0.5s ease',
        }}
      >
        <Header />

        <Container maxWidth={false} sx={{ maxWidth: 1075, py: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 5, md: 7 } }}>
            <Summary />
            <Experience />
            <OpenSource />
            <Skills />
            <Education />
          </Box>

        </Container>

        {/* Footer — full-width with fading effects */}
        <Box
          component="footer"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 160, md: 200 },
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 3,
          }}
        >
          {/* Fade overlay — uses same bg as page so there's no seam */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: (t) => `linear-gradient(to bottom, ${t.palette.background.default}, transparent)`,
              zIndex: 1,
              pointerEvents: 'none',
              transition: 'background 0.5s ease',
            }}
          />
          {settings.particles && <ParticleCanvas />}
          {settings.waves && <WaveEffect position="bottom" flip />}
          <Box sx={{ position: 'relative', zIndex: 2, color: 'text.secondary', fontSize: '0.8rem', textAlign: 'center' }}>
            Leo Dan Peña · {new Date().getFullYear()}
            <br />
            <Box
              component="a"
              href="https://github.com/leo9-py/leo9-py.github.io"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'text.secondary', opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              Source on GitHub
            </Box>
          </Box>
        </Box>
      </Box>

      <SettingsPanel />
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ResumeContent />
    </SettingsProvider>
  )
}
