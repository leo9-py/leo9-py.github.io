import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSettings } from '../../context/SettingsContext'
import { COLOR_SCHEMES } from '../../data/colorSchemes'
import { hexToRgb, lighten, darken } from '../../utils/color'

type RGB = [number, number, number]

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}
function rgbStr(c: RGB): string {
  return `${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])}`
}

interface Props {
  position?: 'top' | 'bottom'
  flip?: boolean
}

interface WaveLayer {
  baseYFrac: number
  harmonics: Array<{ amp: number; freq: number; speed: number }>
  phase: number
  alpha: number
}

const WAVE_LAYERS: WaveLayer[] = [
  {
    baseYFrac: 0.83,
    harmonics: [
      { amp: 0.058, freq: 0.7, speed: 0.28 },
      { amp: 0.030, freq: 1.5, speed: -0.18 },
    ],
    phase: Math.PI * 0.65,
    alpha: 0.45,
  },
  {
    baseYFrac: 0.76,
    harmonics: [
      { amp: 0.072, freq: 0.8, speed: 0.22 },
      { amp: 0.038, freq: 1.6, speed: 0.14 },
    ],
    phase: 0,
    alpha: 0.85,
  },
]

const FOAM_COUNT = 28

export default function WaveEffect({ position = 'bottom', flip = false }: Props) {
  const { settings } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  // Target and current colors for smooth lerping
  const targetRef = useRef<{ light: RGB; base: RGB; dark: RGB; foam: RGB; isDark: boolean }>({
    light: [190, 225, 255], base: [80, 155, 220], dark: [40, 100, 180], foam: [220, 240, 255], isDark: true,
  })
  const currentRef = useRef<{ light: RGB; base: RGB; dark: RGB; foam: RGB; isDark: boolean }>({
    light: [190, 225, 255], base: [80, 155, 220], dark: [40, 100, 180], foam: [220, 240, 255], isDark: true,
  })

  // Update targets when scheme changes
  useEffect(() => {
    const scheme = COLOR_SCHEMES[settings.colorScheme] ?? COLOR_SCHEMES[0]
    const isDark = settings.darkMode
    const waveHex = isDark ? scheme.particle.dark : scheme.particle.light
    const wRgb = hexToRgb(waveHex)
    targetRef.current = {
      light: lighten(wRgb, 0.5),
      base: wRgb,
      dark: darken(wRgb, 0.4),
      foam: isDark ? lighten(wRgb, 0.7) : [255, 255, 255] as RGB,
      isDark,
    }
  }, [settings.darkMode, settings.colorScheme])

  // Main animation loop — only restarts when waves toggled
  useEffect(() => {
    if (!settings.waves) return

    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    // Initialize current to target
    currentRef.current = { ...targetRef.current }

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

    const foam = Array.from({ length: FOAM_COUNT }, () => ({
      xFrac: Math.random(),
      phaseSeed: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.5,
      size: 0.8 + Math.random() * 1.4,
      yOffset: -2 - Math.random() * 5,
      layerIdx: Math.random() < 0.65 ? 1 : 0,
    }))

    let t = 0
    let lastTs: number | null = null

    function waveY(x: number, w: number, h: number, layer: WaveLayer): number {
      const xn = x / w
      let y = layer.baseYFrac * h
      for (const harm of layer.harmonics) {
        y += h * harm.amp * Math.sin(xn * Math.PI * 2 * harm.freq + t * harm.speed + layer.phase)
      }
      return y
    }

    function drawLayer(layer: WaveLayer) {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const steps = 180
      const cur = currentRef.current

      const pts: Array<[number, number]> = []
      for (let i = 0; i <= steps; i++) {
        const x = -20 + (i / steps) * (w + 40)
        pts.push([x, waveY(x, w, h, layer)])
      }

      const avgY = pts.reduce((s, [, y]) => s + y, 0) / pts.length

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      ctx.lineTo(w + 20, h + 4)
      ctx.lineTo(-20, h + 4)
      ctx.closePath()

      const wl = rgbStr(cur.light)
      const wb = rgbStr(cur.base)
      const wd = rgbStr(cur.dark)

      const grad = ctx.createLinearGradient(0, avgY - 10, 0, h)
      if (cur.isDark) {
        grad.addColorStop(0,    `rgba(${wl},${layer.alpha * 0.38})`)
        grad.addColorStop(0.18, `rgba(${wb},${layer.alpha * 0.22})`)
        grad.addColorStop(0.55, `rgba(${wd},${layer.alpha * 0.10})`)
        grad.addColorStop(1,    `rgba(${wd},0)`)
      } else {
        grad.addColorStop(0,    `rgba(${wl},${layer.alpha * 0.32})`)
        grad.addColorStop(0.18, `rgba(${wb},${layer.alpha * 0.18})`)
        grad.addColorStop(0.55, `rgba(${wd},${layer.alpha * 0.08})`)
        grad.addColorStop(1,    `rgba(${wd},0)`)
      }
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      // Foam band
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1] - 4)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1] - 4)
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + 3)
      ctx.closePath()

      const fm = rgbStr(cur.foam)
      const foamGrad = ctx.createLinearGradient(0, avgY - 6, 0, avgY + 4)
      foamGrad.addColorStop(0,    `rgba(${fm},0)`)
      foamGrad.addColorStop(0.45, `rgba(${fm},${layer.alpha * (cur.isDark ? 0.30 : 0.55)})`)
      foamGrad.addColorStop(1,    `rgba(${fm},0)`)
      ctx.fillStyle = foamGrad
      ctx.fill()
      ctx.restore()
    }

    function drawFoam() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const fm = rgbStr(currentRef.current.foam)

      for (const fb of foam) {
        const layer = WAVE_LAYERS[fb.layerIdx]
        const x = fb.xFrac * w
        const y = waveY(x, w, h, layer) + fb.yOffset
        const alpha = Math.max(0, 0.5 + 0.5 * Math.sin(t * fb.speed + fb.phaseSeed)) * 0.18

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgba(${fm},1)`
        ctx.beginPath()
        ctx.arc(x, y, fb.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    function tick(ts: number) {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      t += dt

      // Lerp colors toward target
      const lerpSpeed = Math.min(1, dt * 2.8)
      const cur = currentRef.current
      const tgt = targetRef.current
      cur.light = lerpRgb(cur.light, tgt.light, lerpSpeed)
      cur.base  = lerpRgb(cur.base, tgt.base, lerpSpeed)
      cur.dark  = lerpRgb(cur.dark, tgt.dark, lerpSpeed)
      cur.foam  = lerpRgb(cur.foam, tgt.foam, lerpSpeed)
      cur.isDark = tgt.isDark

      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      for (const layer of WAVE_LAYERS) drawLayer(layer)
      drawFoam()

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [settings.waves]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!settings.waves) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position]: 0,
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </Box>
  )
}
