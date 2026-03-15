import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSettings } from '../../context/SettingsContext'

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

// Two water layers — back layer sits slightly lower
const WAVE_LAYERS: WaveLayer[] = [
  {
    baseYFrac: 0.83,
    harmonics: [
      { amp: 0.058, freq: 0.7,  speed: 0.28  },
      { amp: 0.030, freq: 1.5,  speed: -0.18 },
    ],
    phase: Math.PI * 0.65,
    alpha: 0.45,
  },
  {
    baseYFrac: 0.76,
    harmonics: [
      { amp: 0.072, freq: 0.8,  speed: 0.22 },
      { amp: 0.038, freq: 1.6,  speed: 0.14 },
    ],
    phase: 0,
    alpha: 0.85,
  },
]

// Foam bubbles that drift near the wave crest
const FOAM_COUNT = 28

export default function WaveEffect({ position = 'bottom', flip = false }: Props) {
  const { settings } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  useEffect(() => {
    if (!settings.waves) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = settings.darkMode

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

    // Stable foam descriptors
    const foam = Array.from({ length: FOAM_COUNT }, () => ({
      xFrac:     Math.random(),
      phaseSeed: Math.random() * Math.PI * 2,
      speed:     0.4 + Math.random() * 0.5,   // slow fade cycle
      size:      0.8 + Math.random() * 1.4,
      yOffset:   -2 - Math.random() * 5,       // sit just above crest
      layerIdx:  Math.random() < 0.65 ? 1 : 0,
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

      const pts: Array<[number, number]> = []
      for (let i = 0; i <= steps; i++) {
        const x = -20 + (i / steps) * (w + 40)
        pts.push([x, waveY(x, w, h, layer)])
      }

      const avgY = pts.reduce((s, [, y]) => s + y, 0) / pts.length

      // ── Water body: gradient fill from crest to bottom ──
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
      ctx.lineTo(w + 20, h + 4)
      ctx.lineTo(-20,    h + 4)
      ctx.closePath()

      const grad = ctx.createLinearGradient(0, avgY - 10, 0, h)
      if (isDark) {
        grad.addColorStop(0,    `rgba(190,225,255,${layer.alpha * 0.38})`)
        grad.addColorStop(0.18, `rgba(80,155,220,${layer.alpha * 0.22})`)
        grad.addColorStop(0.55, `rgba(40,100,180,${layer.alpha * 0.10})`)
        grad.addColorStop(1,    'rgba(20,60,140,0)')
      } else {
        grad.addColorStop(0,    `rgba(200,225,255,${layer.alpha * 0.32})`)
        grad.addColorStop(0.18, `rgba(0,90,180,${layer.alpha   * 0.18})`)
        grad.addColorStop(0.55, `rgba(0,60,140,${layer.alpha   * 0.08})`)
        grad.addColorStop(1,    'rgba(0,40,120,0)')
      }
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      // ── Foam band at crest: filled sliver, no glow ──
      ctx.save()
      ctx.beginPath()
      // Top of foam band (slightly above crest)
      ctx.moveTo(pts[0][0], pts[0][1] - 4)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1] - 4)
      // Bottom of foam band (slightly below crest)
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + 3)
      ctx.closePath()

      const foamGrad = ctx.createLinearGradient(0, avgY - 6, 0, avgY + 4)
      if (isDark) {
        foamGrad.addColorStop(0,   `rgba(230,245,255,0)`)
        foamGrad.addColorStop(0.45, `rgba(210,235,255,${layer.alpha * 0.30})`)
        foamGrad.addColorStop(1,   `rgba(180,215,255,0)`)
      } else {
        foamGrad.addColorStop(0,   `rgba(255,255,255,0)`)
        foamGrad.addColorStop(0.45, `rgba(255,255,255,${layer.alpha * 0.55})`)
        foamGrad.addColorStop(1,   `rgba(200,225,255,0)`)
      }
      ctx.fillStyle = foamGrad
      ctx.fill()
      ctx.restore()
    }

    function drawFoam() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      for (const fb of foam) {
        const layer = WAVE_LAYERS[fb.layerIdx]
        const x = fb.xFrac * w
        const y = waveY(x, w, h, layer) + fb.yOffset
        // Slow gentle fade — no squaring, no glow
        const alpha = Math.max(0, 0.5 + 0.5 * Math.sin(t * fb.speed + fb.phaseSeed)) * 0.18

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = isDark ? 'rgba(220,240,255,1)' : 'rgba(255,255,255,1)'
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
  }, [settings.waves, settings.darkMode])

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
