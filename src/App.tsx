import { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import { buildTheme } from './theme'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import SettingsPanel from './components/SettingsPanel'
import Header from './components/Header'
import Summary from './components/Summary'
import Experience from './components/Experience'
import OpenSource from './components/OpenSource'
import Skills from './components/Skills'
import Education from './components/Education'
import WaveEffect from './components/effects/WaveEffect'
import ParticleCanvas from './components/effects/ParticleCanvas'

function ResumeContent() {
  const { settings } = useSettings()
  const theme = useMemo(() => buildTheme(settings.darkMode), [settings.darkMode])

  const pulsateKeyframes = `
    @keyframes pulsateText {
      0%, 100% { opacity: 1; text-shadow: none; }
      50% {
        opacity: 0.85;
        text-shadow: 0 0 12px ${settings.darkMode ? 'rgba(100,181,246,0.6)' : 'rgba(0,80,160,0.4)'};
      }
    }
    @keyframes pulsateHeading {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.15) drop-shadow(0 0 8px ${settings.darkMode ? 'rgba(100,181,246,0.5)' : 'rgba(0,80,160,0.35)'}); }
    }
  `

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*, *::before, *::after': { boxSizing: 'border-box' },
          ...(settings.pulsate && {
            '.pulsate-heading': {
              animation: 'pulsateHeading 3s ease-in-out infinite',
            },
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
          transition: 'background-color 0.4s ease',
        }}
      >
        <Header />

        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 5, md: 7 } }}>
            <Summary />
            <Experience />
            <OpenSource />
            <Skills />
            <Education />
          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              mt: 8,
              py: 3,
              textAlign: 'center',
              borderTop: '1px solid',
              borderColor: settings.darkMode ? 'rgba(48,54,61,0.8)' : 'rgba(0,80,160,0.12)',
              color: 'text.secondary',
              fontSize: '0.8rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {settings.particles && (
              <ParticleCanvas height={80} />
            )}
            {settings.waves && (
              <WaveEffect position="bottom" flip />
            )}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              Leo Dan Peña · {new Date().getFullYear()}
            </Box>
          </Box>
        </Container>
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
