import { useRef, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import type { SxProps, Theme } from '@mui/material/styles'
import { useSettings } from '../../context/SettingsContext'
import { useColorScheme } from '../../hooks/useColorScheme'
import { hexToRgb } from '../../utils/color'

interface Props {
  children: React.ReactNode
  sx?: SxProps<Theme>
}

export default function GlassCard({ children, sx }: Props) {
  const { settings } = useSettings()
  const ref = useRef<HTMLDivElement>(null)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [shineX, setShineX] = useState(50)
  const [shineY, setShineY] = useState(50)
  const [hovered, setHovered] = useState(false)

  const isDark = settings.darkMode
  const scheme = useColorScheme()
  const accentRgb = hexToRgb(isDark ? scheme.primary.dark : scheme.primary.light)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTiltX(-dy * 1)
    setTiltY(dx * 1)
    setShineX(((e.clientX - rect.left) / rect.width) * 100)
    setShineY(((e.clientY - rect.top) / rect.height) * 100)
  }, [])

  const handleMouseEnter = useCallback(() => setHovered(true), [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setTiltX(0)
    setTiltY(0)
  }, [])

  const glassEnabled = settings.gaussian

  return (
    <Box sx={{ perspective: '900px' }}>
      <Card
        ref={ref}
        elevation={0}
        onMouseMove={glassEnabled ? handleMouseMove : undefined}
        onMouseEnter={glassEnabled ? handleMouseEnter : undefined}
        onMouseLeave={glassEnabled ? handleMouseLeave : undefined}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          ...(glassEnabled && {
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hovered ? 1.005 : 1})`,
            transition: hovered
              ? 'transform 0.12s ease'
              : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            // Glass top-edge highlight
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '1px',
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)',
              zIndex: 2,
              pointerEvents: 'none',
            },
            // Elevated shadow when tilted
            ...(hovered && {
              boxShadow: isDark
                ? `0 ${6 + Math.abs(tiltX)}px ${16 + Math.abs(tiltX) * 2}px rgba(0,0,0,0.35),
                   0 0 0 1px rgba(${accentRgb},0.12),
                   inset 0 1px 0 rgba(255,255,255,0.04)`
                : `0 ${6 + Math.abs(tiltX)}px ${16 + Math.abs(tiltX) * 2}px rgba(${accentRgb},0.10),
                   0 0 0 1px rgba(${accentRgb},0.10),
                   inset 0 1px 0 rgba(255,255,255,0.5)`,
            }),
          }),
          ...sx,
        }}
      >
        {/* Specular / glare highlight that tracks the mouse */}
        {glassEnabled && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 2,
              borderRadius: 'inherit',
              opacity: hovered ? 1 : 0,
              transition: hovered ? 'opacity 0.05s' : 'opacity 0.4s ease',
              background: `radial-gradient(circle at ${shineX}% ${shineY}%,
                ${isDark
                  ? 'rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 30%, transparent 60%'
                  : 'rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 30%, transparent 60%'
                })`,
            }}
          />
        )}

        {/* Static glass texture — subtle top-to-bottom gradient always present when enabled */}
        {glassEnabled && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              background: isDark
                ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 40%)',
              borderRadius: 'inherit',
            }}
          />
        )}

        {children}
      </Card>
    </Box>
  )
}
