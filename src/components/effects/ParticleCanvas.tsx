import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useSettings } from '../../context/SettingsContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  alphaDecay: number
  color: string
  flashPhase: number
  flashSpeed: number
}

interface Props {
  height?: number
}

export default function ParticleCanvas({ height = 320 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { settings } = useSettings()
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    if (!settings.particles) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = settings.darkMode
      ? ['#a8d8ff', '#c8e8ff', '#e0b4ff', '#ffffff', '#b0eaff', '#ffe0a0', '#ffd0f0']
      : ['#2090ff', '#40b0ff', '#a040e0', '#20c0ff', '#0060c0', '#ff80a0', '#80d0ff']

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.4 + 0.1),
      radius: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.5 + 0.5,
      alphaDecay: Math.random() * 0.0008 + 0.0003,
      color: colors[Math.floor(Math.random() * colors.length)],
      flashPhase: Math.random() * Math.PI * 2,
      flashSpeed: 0.5 + Math.random() * 0.8,
    })

    for (let i = 0; i < 18; i++) {
      const p = spawn()
      p.y = Math.random() * canvas.height
      particlesRef.current.push(p)
    }

    let t = 0
    let lastTs: number | null = null

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts
      t += dt

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.08) particlesRef.current.push(spawn())

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.alphaDecay

        const a = Math.max(0, p.alpha)

        // Flash multiplier: peaks sharply, mostly dim (power curve for HDR spike)
        const rawFlash = Math.max(0, Math.sin(t * p.flashSpeed + p.flashPhase))
        const flash = rawFlash ** 2.5  // sharp bright spikes, mostly dark

        const bloomA  = a * (0.4 + flash * 0.7)
        const coreA   = a * (0.7 + flash * 1.0)
        const glowSize = p.radius * (5 + flash * 6)
        const coreSize = p.radius * (0.35 + flash * 0.2)

        // Outer bloom
        ctx.save()
        ctx.globalAlpha = Math.min(1, bloomA)
        ctx.shadowColor = p.color
        ctx.shadowBlur  = glowSize
        ctx.fillStyle   = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * (1 + flash * 0.2), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // White-hot core — extra bright burst ring at peak flash
        if (flash > 0.5) {
          ctx.save()
          ctx.globalAlpha = Math.min(1, a * (flash - 0.5) * 1.5)
          ctx.shadowColor = '#ffffff'
          ctx.shadowBlur  = p.radius * 8
          ctx.fillStyle   = '#ffffff'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Core dot
        ctx.save()
        ctx.globalAlpha = Math.min(1, coreA)
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur  = p.radius * (3 + flash * 8)
        ctx.fillStyle   = '#ffffff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      particlesRef.current = []
    }
  }, [settings.particles, settings.darkMode])

  if (!settings.particles) return null

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
