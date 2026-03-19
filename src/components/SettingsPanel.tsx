import { useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import SettingsIcon from '@mui/icons-material/Settings'
import FlareIcon from '@mui/icons-material/Flare'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import WaterIcon from '@mui/icons-material/Water'
import { useSettings, Settings } from '../context/SettingsContext'
import { COLOR_SCHEMES } from '../data/colorSchemes'
import { hexToRgb } from '../utils/color'

interface OptionDef {
  key: keyof Settings
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
}

const options: OptionDef[] = [
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
  const { settings, toggle, setColorScheme } = useSettings()
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(0)
  const [attentionSpin, setAttentionSpin] = useState(false)
  const hasInteracted = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Attention spin after 15s if user hasn't interacted with settings, max 10s duration
  useEffect(() => {
    const startTimer = setTimeout(() => {
      if (!hasInteracted.current) setAttentionSpin(true)
    }, 15000)
    const stopTimer = setTimeout(() => {
      setAttentionSpin(false)
    }, 25000)
    return () => { clearTimeout(startTimer); clearTimeout(stopTimer) }
  }, [])

  const isDark = settings.darkMode
  const scheme = COLOR_SCHEMES[settings.colorScheme] ?? COLOR_SCHEMES[0]
  const accent = isDark ? scheme.primary.dark : scheme.primary.light
  const aRgb = hexToRgb(accent)

  const close = useCallback(() => setOpen(false), [])

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      ) return
      close()
    }

    const handleScroll = () => close()

    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open, close])

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
        ref={btnRef}
        onClick={() => {
          hasInteracted.current = true
          setAttentionSpin(false)
          setOpen((v) => !v)
        }}
        sx={{
          width: 44,
          height: 44,
          background: isDark
            ? 'rgba(22, 27, 34, 0.85)'
            : 'rgba(240,244,248,0.85)',
          border: `1px solid ${isDark ? `${accent}40` : `${accent}33`}`,
          backdropFilter: 'blur(12px)',
          color: accent,
          transition: 'all 0.3s ease',
          '@keyframes cogSpin': {
            '0%': { transform: 'rotate(0deg)', filter: 'blur(0px)' },
            '30%': { transform: 'rotate(180deg)', filter: 'blur(0px)' },
            '50%': { transform: 'rotate(540deg)', filter: 'blur(1.5px)' },
            '65%': { transform: 'rotate(720deg)', filter: 'blur(0px)' },
            '100%': { transform: 'rotate(720deg)', filter: 'blur(0px)' },
          },
          '@keyframes borderFlash': {
            '0%, 100%': { borderColor: isDark ? `${accent}40` : `${accent}33` },
            '50%': { borderColor: accent },
          },
          ...(attentionSpin && !open && {
            animation: 'cogSpin 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite, borderFlash 0.6s ease infinite',
          }),
          '&:hover': {
            background: isDark
              ? `${accent}26`
              : `${accent}1a`,
            transform: 'rotate(30deg)',
          },
          ...(open && { transform: 'rotate(45deg)', animation: 'none' }),
        }}
        aria-label="Toggle settings"
      >
        <SettingsIcon />
      </IconButton>

      {/* Panel with Material-style animation */}
      <Grow in={open} timeout={{ enter: 250, exit: 180 }} style={{ transformOrigin: 'top right' }}>
            <Box
              ref={panelRef}
              sx={{
                background: isDark
                  ? `linear-gradient(160deg, rgba(${Math.round(10 + aRgb[0] * 0.06)},${Math.round(18 + aRgb[1] * 0.06)},${Math.round(35 + aRgb[2] * 0.06)},0.95) 0%, rgba(${Math.round(5 + aRgb[0] * 0.04)},${Math.round(10 + aRgb[1] * 0.04)},${Math.round(20 + aRgb[2] * 0.04)},0.98) 100%)`
                  : `linear-gradient(160deg, rgba(${Math.round(210 + aRgb[0] * 0.04)},${Math.round(228 + aRgb[1] * 0.04)},${Math.round(250 + aRgb[2] * 0.04)},0.97) 0%, rgba(${Math.round(190 + aRgb[0] * 0.04)},${Math.round(215 + aRgb[1] * 0.04)},${Math.round(248 + aRgb[2] * 0.04)},0.98) 100%)`,
                border: `1px solid ${isDark ? `${accent}2e` : `${accent}2e`}`,
                borderRadius: 1.5,
                backdropFilter: 'blur(20px)',
                boxShadow: isDark
                  ? `0 8px 40px rgba(0,0,0,0.7), 0 0 60px ${accent}0d inset`
                  : `0 8px 40px rgba(0,60,140,0.18)`,
                overflow: 'hidden',
                minWidth: 200,
                transition: 'background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
              }}
            >
              {/* XMB header bar */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  background: isDark
                    ? `linear-gradient(90deg, ${accent}1f 0%, transparent 100%)`
                    : `linear-gradient(90deg, ${accent}1f 0%, transparent 100%)`,
                  borderBottom: `1px solid ${isDark ? `${accent}1a` : `${accent}1a`}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: isDark ? `${accent}b3` : `${accent}cc`,
                    lineHeight: 1,
                  }}
                >
                  Display Settings
                </Typography>
              </Box>

              {/* Toggle options */}
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
                            ? `linear-gradient(90deg, ${accent}26 0%, ${accent}0d 100%)`
                            : `linear-gradient(90deg, ${accent}1f 0%, ${accent}0a 100%)`
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
                              background: accent,
                            }
                          : {},
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          color: active
                            ? accent
                            : isDark ? 'rgba(139,148,158,0.5)' : 'rgba(80,100,130,0.45)',
                          display: 'flex',
                          fontSize: 20,
                          transition: 'all 0.2s',
                          filter: active && isFocused
                            ? `drop-shadow(0 0 6px ${accent}cc)`
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
                            ? `${accent}33`
                            : isDark
                              ? 'rgba(139,148,158,0.1)'
                              : 'rgba(80,100,130,0.08)',
                          color: active
                            ? accent
                            : isDark ? 'rgba(139,148,158,0.5)' : 'rgba(80,100,130,0.45)',
                          border: `1px solid ${active
                            ? `${accent}59`
                            : isDark ? 'rgba(139,148,158,0.15)' : 'rgba(80,100,130,0.12)'}`,
                        }}
                      >
                        {active ? 'ON' : 'OFF'}
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  height: 1,
                  mx: 1.5,
                  background: isDark
                    ? `linear-gradient(90deg, transparent, ${accent}26, transparent)`
                    : `linear-gradient(90deg, transparent, ${accent}1f, transparent)`,
                }}
              />

              {/* Theme header bar */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  background: isDark
                    ? `linear-gradient(90deg, ${accent}1f 0%, transparent 100%)`
                    : `linear-gradient(90deg, ${accent}1f 0%, transparent 100%)`,
                  borderBottom: `1px solid ${isDark ? `${accent}1a` : `${accent}1a`}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: isDark ? `${accent}b3` : `${accent}cc`,
                    lineHeight: 1,
                  }}
                >
                  Theme
                </Typography>
              </Box>

              {/* Color scheme swatches */}
              <Box sx={{ px: 1.5, py: 1.2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                  {COLOR_SCHEMES.map((cs, i) => {
                    const selected = settings.colorScheme === i
                    return (
                      <Box
                        key={cs.name}
                        onClick={() => setColorScheme(i)}
                        title={cs.name}
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 1,
                          background: cs.swatch,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: selected
                            ? `2px solid ${isDark ? '#e6edf3' : '#0a1929'}`
                            : '2px solid transparent',
                          boxShadow: selected
                            ? `0 0 8px ${cs.swatch}80`
                            : 'none',
                          '&:hover': {
                            transform: 'scale(1.15)',
                            boxShadow: `0 0 8px ${cs.swatch}60`,
                          },
                        }}
                      />
                    )
                  })}
                </Box>
              </Box>

              {/* XMB-style reflection bar */}
              <Box
                sx={{
                  height: 1,
                  mx: 1.5,
                  mb: 1,
                  background: isDark
                    ? `linear-gradient(90deg, transparent, ${accent}26, transparent)`
                    : `linear-gradient(90deg, transparent, ${accent}1f, transparent)`,
                }}
              />
            </Box>
      </Grow>
    </Box>
  )
}
