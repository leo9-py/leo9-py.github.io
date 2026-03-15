import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSettings } from '../../context/SettingsContext'

export default function GodLight() {
  const { settings } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.resetTransform()
      ctx.scale(dpr, dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0
    let lastTs: number | null = null

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      t += dt

      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const diag = Math.sqrt(w * w + h * h)

      ctx.clearRect(0, 0, w, h)

      // Slow global pulse
      const pulse = 0.82 + 0.18 * Math.sin(t * 0.11)
      // Origin sits well above/left of the corner so light sweeps downward diagonally
      // Moves more freely to give the light a roaming feel
      const ox = w * -0.18 + Math.sin(t * 0.11) * w * 0.14
      const oy = h * -0.22 + Math.sin(t * 0.09 + 0.8) * h * 0.12

      const isDark = settings.darkMode

      // Outer halo — deep indigo/violet wash
      const r0 = diag * (0.95 + 0.05 * Math.sin(t * 0.09))
      const g0 = ctx.createRadialGradient(ox, oy, 0, ox, oy, r0)
      if (isDark) {
        g0.addColorStop(0,    `rgba(80,140,220,${0.22 * pulse})`)
        g0.addColorStop(0.30, `rgba(60,100,190,${0.10 * pulse})`)
        g0.addColorStop(0.60, `rgba(40,60,140,${0.032 * pulse})`)
        g0.addColorStop(1,    'rgba(20,30,80,0)')
      } else {
        g0.addColorStop(0,    `rgba(255,235,170,${0.16 * pulse})`)
        g0.addColorStop(0.30, `rgba(240,200,120,${0.07 * pulse})`)
        g0.addColorStop(0.60, `rgba(200,160,80,${0.022 * pulse})`)
        g0.addColorStop(1,    'rgba(160,120,40,0)')
      }
      ctx.fillStyle = g0
      ctx.fillRect(0, 0, w, h)

      // Mid layer — teal/cyan shift for color depth
      const r1m = diag * (0.55 + 0.06 * Math.sin(t * 0.08 + 2.1))
      const gm = ctx.createRadialGradient(ox, oy, 0, ox, oy, r1m)
      if (isDark) {
        gm.addColorStop(0,    `rgba(60,180,200,${0.10 * pulse})`)
        gm.addColorStop(0.45, `rgba(40,130,170,${0.038 * pulse})`)
        gm.addColorStop(1,    'rgba(20,80,120,0)')
      } else {
        gm.addColorStop(0,    `rgba(255,210,120,${0.08 * pulse})`)
        gm.addColorStop(0.45, `rgba(230,170,80,${0.030 * pulse})`)
        gm.addColorStop(1,    'rgba(180,130,40,0)')
      }
      ctx.fillStyle = gm
      ctx.fillRect(0, 0, w, h)

      // Inner bright core — punchy near the corner
      const r1 = diag * (0.32 + 0.04 * Math.sin(t * 0.13 + 1.2))
      const g1 = ctx.createRadialGradient(ox, oy, 0, ox, oy, r1)
      if (isDark) {
        g1.addColorStop(0,    `rgba(160,220,255,${0.32 * pulse})`)
        g1.addColorStop(0.35, `rgba(100,180,240,${0.12 * pulse})`)
        g1.addColorStop(1,    'rgba(60,120,200,0)')
      } else {
        g1.addColorStop(0,    `rgba(255,255,220,${0.24 * pulse})`)
        g1.addColorStop(0.35, `rgba(255,230,160,${0.09 * pulse})`)
        g1.addColorStop(1,    'rgba(220,180,80,0)')
      }
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [settings.darkMode])

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // No explicit zIndex — DOM order (first child) keeps it behind waves and particles
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </Box>
  )
}
