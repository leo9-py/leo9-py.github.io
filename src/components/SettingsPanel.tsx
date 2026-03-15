import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import FlareIcon from '@mui/icons-material/Flare'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import WaterIcon from '@mui/icons-material/Water'
import { useSettings, Settings } from '../context/SettingsContext'

interface OptionDef {
  key: keyof Settings
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
}

const options: OptionDef[] = [
  {
    key: 'darkMode',
    label: 'Dark Mode',
    icon: <LightModeIcon />,
    activeIcon: <DarkModeIcon />,
  },
  {
    key: 'gaussian',
    label: 'Glass',
    icon: <FlareIcon />,
  },
  {
    key: 'particles',
    label: 'Particles',
    icon: <AutoAwesomeIcon />,
  },
  {
    key: 'pulsate',
    label: 'Pulsate',
    icon: <FiberManualRecordIcon />,
  },
  {
    key: 'waves',
    label: 'Waves',
    icon: <WaterIcon />,
  },
]

export default function SettingsPanel() {
  const { settings, toggle } = useSettings()
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(0)

  const isDark = settings.darkMode

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1,
      }}
    >
      {/* Gear button */}
      <IconButton
        onClick={() => setOpen((v) => !v)}
        sx={{
          width: 44,
          height: 44,
          background: isDark
            ? 'rgba(22, 27, 34, 0.85)'
            : 'rgba(240,244,248,0.85)',
          border: `1px solid ${isDark ? 'rgba(100,181,246,0.25)' : 'rgba(0,80,160,0.2)'}`,
          backdropFilter: 'blur(12px)',
          color: isDark ? '#64b5f6' : '#0050a0',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isDark
              ? 'rgba(100,181,246,0.15)'
              : 'rgba(0,80,160,0.1)',
            transform: 'rotate(30deg)',
          },
          ...(open && { transform: 'rotate(45deg)' }),
        }}
        aria-label="Toggle settings"
      >
        <SettingsIcon />
      </IconButton>

      {/* XMB Panel */}
      {open && (
        <Box
          sx={{
            background: isDark
              ? 'linear-gradient(160deg, rgba(10,18,35,0.95) 0%, rgba(5,10,20,0.98) 100%)'
              : 'linear-gradient(160deg, rgba(210,228,250,0.97) 0%, rgba(190,215,248,0.98) 100%)',
            border: `1px solid ${isDark ? 'rgba(100,181,246,0.18)' : 'rgba(0,80,160,0.18)'}`,
            borderRadius: 3,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark
              ? '0 8px 40px rgba(0,0,0,0.7), 0 0 60px rgba(100,181,246,0.05) inset'
              : '0 8px 40px rgba(0,60,140,0.18)',
            overflow: 'hidden',
            minWidth: 200,
            animation: 'xmbSlideIn 0.22s cubic-bezier(0.22,1,0.36,1)',
            '@keyframes xmbSlideIn': {
              from: { opacity: 0, transform: 'translateY(-8px) scale(0.97)' },
              to: { opacity: 1, transform: 'translateY(0) scale(1)' },
            },
          }}
        >
          {/* XMB header bar */}
          <Box
            sx={{
              px: 2,
              py: 1,
              background: isDark
                ? 'linear-gradient(90deg, rgba(100,181,246,0.12) 0%, transparent 100%)'
                : 'linear-gradient(90deg, rgba(0,80,160,0.12) 0%, transparent 100%)',
              borderBottom: `1px solid ${isDark ? 'rgba(100,181,246,0.1)' : 'rgba(0,80,160,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SettingsIcon sx={{ fontSize: 14, color: isDark ? '#64b5f6' : '#0050a0', opacity: 0.7 }} />
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: isDark ? 'rgba(100,181,246,0.7)' : 'rgba(0,80,160,0.8)',
                lineHeight: 1,
              }}
            >
              Display Settings
            </Typography>
          </Box>

          {/* Options */}
          <Box sx={{ p: 1 }}>
            {options.map((opt, i) => {
              const active = settings[opt.key]
              const isFocused = focused === i
              return (
                <Box
                  key={opt.key}
                  onClick={() => toggle(opt.key)}
                  onMouseEnter={() => setFocused(i)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    background: isFocused
                      ? isDark
                        ? 'linear-gradient(90deg, rgba(100,181,246,0.15) 0%, rgba(100,181,246,0.05) 100%)'
                        : 'linear-gradient(90deg, rgba(0,80,160,0.12) 0%, rgba(0,80,160,0.04) 100%)'
                      : 'transparent',
                    '&::before': isFocused
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          height: '60%',
                          width: 2,
                          borderRadius: 1,
                          background: isDark ? '#64b5f6' : '#0050a0',
                        }
                      : {},
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      color: active
                        ? isDark ? '#64b5f6' : '#0050a0'
                        : isDark ? 'rgba(139,148,158,0.5)' : 'rgba(80,100,130,0.45)',
                      display: 'flex',
                      fontSize: 20,
                      transition: 'all 0.2s',
                      filter: active && isFocused
                        ? isDark
                          ? 'drop-shadow(0 0 6px rgba(100,181,246,0.8))'
                          : 'drop-shadow(0 0 6px rgba(0,80,160,0.5))'
                        : 'none',
                    }}
                  >
                    {active && opt.activeIcon ? opt.activeIcon : opt.icon}
                  </Box>

                  {/* Label */}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      fontSize: '0.82rem',
                      fontWeight: isFocused ? 600 : 400,
                      color: isDark
                        ? isFocused ? '#e6edf3' : 'rgba(139,148,158,0.8)'
                        : isFocused ? '#0a1929' : 'rgba(40,60,90,0.75)',
                      transition: 'color 0.15s',
                    }}
                  >
                    {opt.label}
                  </Typography>

                  {/* On/Off pill */}
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      lineHeight: 1.6,
                      transition: 'all 0.2s',
                      background: active
                        ? isDark
                          ? 'rgba(100,181,246,0.2)'
                          : 'rgba(0,80,160,0.15)'
                        : isDark
                          ? 'rgba(139,148,158,0.1)'
                          : 'rgba(80,100,130,0.08)',
                      color: active
                        ? isDark ? '#64b5f6' : '#0050a0'
                        : isDark ? 'rgba(139,148,158,0.5)' : 'rgba(80,100,130,0.45)',
                      border: `1px solid ${active
                        ? isDark ? 'rgba(100,181,246,0.35)' : 'rgba(0,80,160,0.3)'
                        : isDark ? 'rgba(139,148,158,0.15)' : 'rgba(80,100,130,0.12)'}`,
                    }}
                  >
                    {active ? 'ON' : 'OFF'}
                  </Box>
                </Box>
              )
            })}
          </Box>

          {/* XMB-style reflection bar */}
          <Box
            sx={{
              height: 1,
              mx: 1.5,
              mb: 1,
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(100,181,246,0.15), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(0,80,160,0.12), transparent)',
            }}
          />
        </Box>
      )}
    </Box>
  )
}
