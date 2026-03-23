import { useRef, useState, useCallback, useEffect } from 'react'
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

  // Smooth lerp targets
  const targetRef = useRef({ tiltX: 0, tiltY: 0, shineX: 50, shineY: 50 })
  const currentRef = useRef({ tiltX: 0, tiltY: 0, shineX: 50, shineY: 50 })
  const animRef = useRef<number>(0)
  const hoveredRef = useRef(false)

  const isDark = settings.darkMode
  const scheme = useColorScheme()
  const accentRgb = hexToRgb(isDark ? scheme.primary.dark : scheme.primary.light)
  const glassEnabled = settings.gaussian

  // Smooth animation loop — lerp current values toward target
  useEffect(() => {
    if (!glassEnabled) return

    let lastTs: number | null = null

    function tick(ts: number) {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts

      const cur = currentRef.current
      const tgt = targetRef.current
      const lerpFactor = 1 - Math.pow(0.02, dt) // ~5-6 frames to settle, smooth ease-out

      cur.tiltX += (tgt.tiltX - cur.tiltX) * lerpFactor
      cur.tiltY += (tgt.tiltY - cur.tiltY) * lerpFactor
      cur.shineX += (tgt.shineX - cur.shineX) * lerpFactor
      cur.shineY += (tgt.shineY - cur.shineY) * lerpFactor

      setTiltX(cur.tiltX)
      setTiltY(cur.tiltY)
      setShineX(cur.shineX)
      setShineY(cur.shineY)

      // Keep animating while hovered or values haven't settled
      const settled = !hoveredRef.current &&
        Math.abs(cur.tiltX) < 0.01 && Math.abs(cur.tiltY) < 0.01
      if (!settled) {
        animRef.current = requestAnimationFrame(tick)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [glassEnabled])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    targetRef.current.tiltX = -dy * 1
    targetRef.current.tiltY = dx * 1
    targetRef.current.shineX = ((e.clientX - rect.left) / rect.width) * 100
    targetRef.current.shineY = ((e.clientY - rect.top) / rect.height) * 100
  }, [])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    hoveredRef.current = true
    // Restart animation loop
    cancelAnimationFrame(animRef.current)
    let lastTs: number | null = null
    function tick(ts: number) {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts

      const cur = currentRef.current
      const tgt = targetRef.current
      const lerpFactor = 1 - Math.pow(0.02, dt)

      cur.tiltX += (tgt.tiltX - cur.tiltX) * lerpFactor
      cur.tiltY += (tgt.tiltY - cur.tiltY) * lerpFactor
      cur.shineX += (tgt.shineX - cur.shineX) * lerpFactor
      cur.shineY += (tgt.shineY - cur.shineY) * lerpFactor

      setTiltX(cur.tiltX)
      setTiltY(cur.tiltY)
      setShineX(cur.shineX)
      setShineY(cur.shineY)

      const settled = !hoveredRef.current &&
        Math.abs(cur.tiltX) < 0.01 && Math.abs(cur.tiltY) < 0.01
      if (!settled) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    hoveredRef.current = false
    targetRef.current.tiltX = 0
    targetRef.current.tiltY = 0
  }, [])

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
            transition: 'scale 0.3s ease',
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
              transition: hovered ? 'opacity 0.15s' : 'opacity 0.4s ease',
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
