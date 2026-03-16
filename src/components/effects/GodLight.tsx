import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSettings } from '../../context/SettingsContext'
import { COLOR_SCHEMES } from '../../data/colorSchemes'
import { lighten, darken } from '../../utils/color'

type RGB = [number, number, number]

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function rgbStr(c: RGB): string {
  return `${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])}`
}

export default function GodLight() {
  const { settings } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  // Target colors (updated instantly when scheme changes)
  const targetRef = useRef<{ base: RGB; mid: RGB; bright: RGB; deep: RGB }>({
    base: [80, 140, 220], mid: [96, 156, 228], bright: [147, 189, 240], deep: [40, 70, 110],
  })
  // Current (rendered) colors — lerped toward target each frame
  const currentRef = useRef<{ base: RGB; mid: RGB; bright: RGB; deep: RGB }>({
    base: [80, 140, 220], mid: [96, 156, 228], bright: [147, 189, 240], deep: [40, 70, 110],
  })

  // Update target when scheme/darkMode changes
  useEffect(() => {
    const scheme = COLOR_SCHEMES[settings.colorScheme] ?? COLOR_SCHEMES[0]
    const glowBase: RGB = settings.darkMode ? scheme.glow.dark : scheme.glow.light
    targetRef.current = {
      base: glowBase,
      mid: lighten(glowBase, 0.2),
      bright: lighten(glowBase, 0.45),
      deep: darken(glowBase, 0.5),
    }
  }, [settings.darkMode, settings.colorScheme])

  // Single animation loop — never restarts on scheme change
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

    // Initialize current to target
    currentRef.current = { ...targetRef.current }

    let t = 0
    let lastTs: number | null = null

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      t += dt

      // Lerp current colors toward target (~0.5s transition)
      const lerpSpeed = Math.min(1, dt * 2.8)
      const cur = currentRef.current
      const tgt = targetRef.current
      cur.base   = lerpRgb(cur.base, tgt.base, lerpSpeed)
      cur.mid    = lerpRgb(cur.mid, tgt.mid, lerpSpeed)
      cur.bright = lerpRgb(cur.bright, tgt.bright, lerpSpeed)
      cur.deep   = lerpRgb(cur.deep, tgt.deep, lerpSpeed)

      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const diag = Math.sqrt(w * w + h * h)

      ctx.clearRect(0, 0, w, h)

      const pulse = 0.82 + 0.18 * Math.sin(t * 0.11)
      const ox = w * -0.18 + Math.sin(t * 0.11) * w * 0.14
      const oy = h * -0.22 + Math.sin(t * 0.09 + 0.8) * h * 0.12

      const base = rgbStr(cur.base)
      const mid = rgbStr(cur.mid)
      const bright = rgbStr(cur.bright)
      const deep = rgbStr(cur.deep)

      // Outer halo
      const r0 = diag * (0.95 + 0.05 * Math.sin(t * 0.09))
      const g0 = ctx.createRadialGradient(ox, oy, 0, ox, oy, r0)
      g0.addColorStop(0,    `rgba(${base},${0.22 * pulse})`)
      g0.addColorStop(0.30, `rgba(${mid},${0.10 * pulse})`)
      g0.addColorStop(0.60, `rgba(${deep},${0.032 * pulse})`)
      g0.addColorStop(1,    `rgba(${deep},0)`)
      ctx.fillStyle = g0
      ctx.fillRect(0, 0, w, h)

      // Mid layer
      const r1m = diag * (0.55 + 0.06 * Math.sin(t * 0.08 + 2.1))
      const gm = ctx.createRadialGradient(ox, oy, 0, ox, oy, r1m)
      gm.addColorStop(0,    `rgba(${mid},${0.10 * pulse})`)
      gm.addColorStop(0.45, `rgba(${base},${0.038 * pulse})`)
      gm.addColorStop(1,    `rgba(${deep},0)`)
      ctx.fillStyle = gm
      ctx.fillRect(0, 0, w, h)

      // Inner bright core
      const r1 = diag * (0.32 + 0.04 * Math.sin(t * 0.13 + 1.2))
      const g1 = ctx.createRadialGradient(ox, oy, 0, ox, oy, r1)
      g1.addColorStop(0,    `rgba(${bright},${0.32 * pulse})`)
      g1.addColorStop(0.35, `rgba(${base},${0.12 * pulse})`)
      g1.addColorStop(1,    `rgba(${deep},0)`)
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </Box>
  )
}
