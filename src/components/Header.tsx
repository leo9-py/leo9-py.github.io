import { useRef, useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useSettings } from '../context/SettingsContext'
import { useColorScheme } from '../hooks/useColorScheme'
import { hexToRgb } from '../utils/color'
import WaveEffect from './effects/WaveEffect'
import ParticleCanvas from './effects/ParticleCanvas'
import GodLight from './effects/GodLight'
import { resumeData } from '../data/resume'

const { name, title, contact } = resumeData

export default function Header() {
  const { settings } = useSettings()
  const scheme = useColorScheme()
  const isDark = settings.darkMode
  const accent = isDark ? scheme.primary.dark : scheme.primary.light
  const accentRgb = hexToRgb(accent)
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [hovered, setHovered] = useState(false)

  // Typewriter effect for subtitle
  const DESCRIPTORS = [
    title,
    'Full-Stack Developer',
    'Legacy Code Modernizer',
    'Clean Code Advocate',
    'Backend Architect',
    'AI-Assisted Dev Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
    'PHP & Python Engineer',
    'Automation Builder',
    'Database Whisperer',
    'Code Reviewer Extraordinaire',
    'Test-Driven Developer',
    'CI/CD Pipeline Craftsman',
    'Debugging Detective',
    'Refactoring Specialist',
    'API Designer',
    'Performance Optimizer',
    'Agile Practitioner',
    'DevOps Dabbler',
    'Git Wizard',
    'SQL Sorcerer',
    'Framework Juggler',
    'Keyboard Warrior',
    'Stack Overflow Survivor',
    'Bug Bounty Hunter',
    'Midnight Coder',
    'Coffee-to-Code Converter',
    'Semicolon Enthusiast',
    'Tab vs Spaces Peacekeeper',
    'Docker Container Wrangler',
    'Microservices Architect',
    'Regex Whisperer',
    'Pixel Perfectionist',
    'Data Migration Specialist',
    'Electron App Builder',
    'React Component Artisan',
    'TypeScript Advocate',
    'Shell Script Ninja',
    'Linux Terminal Lover',
    'Documentation Writer (Sometimes)',
    'Pull Request Machine',
    'Code Smell Detector',
    'Dependency Update Survivor',
    'Merge Conflict Resolver',
    'Production Firefighter',
    'Hotfix Hero',
    'Monolith-to-Micro Converter',
    'ORM Enthusiast',
    'REST API Connoisseur',
    'JSON Wrangler',
    'Payload Architect',
    'Integration Test Champion',
    'Environment Variable Collector',
    'Legacy System Surgeon',
    'Cron Job Scheduler',
    'Log File Archaeologist',
    'Memory Leak Hunter',
    'Thread Safety Guardian',
    'Cache Invalidation Sufferer',
    'Rate Limiter Implementer',
    'OAuth Flow Navigator',
    'Webhook Orchestrator',
    'Queue Message Broker',
    'Event-Driven Thinker',
    'Schema Migration Veteran',
    'Index Optimization Nerd',
    'Query Plan Analyst',
    'Stored Procedure Survivor',
    'Connection Pool Manager',
    'Load Balancer Configurator',
    'SSL Certificate Renewer',
    'CORS Header Debugger',
    'Session Management Expert',
    'Middleware Chain Builder',
    'Error Handler Architect',
    'Retry Logic Engineer',
    'Backoff Strategy Designer',
    'Feature Flag Flipper',
    'A/B Test Implementer',
    'Dark Launch Specialist',
    'Canary Deployment Fan',
    'Blue-Green Deploy Advocate',
    'Rollback Plan Author',
    'Incident Postmortem Writer',
    'On-Call Rotation Veteran',
    'Monitoring Dashboard Builder',
    'Alert Fatigue Fighter',
    'SLA Guardian',
    'Latency Reducer',
    'Throughput Maximizer',
    'Bottleneck Buster',
    'Memory Profiler',
    'CPU Cycle Counter',
    'Garbage Collection Tuner',
    'Payload Compressor',
    'Batch Job Orchestrator',
    'ETL Pipeline Plumber',
    'Data Integrity Enforcer',
    'Idempotency Key Generator',
    'Race Condition Preventer',
  ]
  const [displayText, setDisplayText] = useState(DESCRIPTORS[0])
  const [highlighted, setHighlighted] = useState(false)
  // phase: 'typing' | 'paused' | 'highlighted' | 'deleting'
  const phaseRef = useRef<'typing' | 'paused' | 'highlighted' | 'deleting'>('paused')
  const phraseIdxRef = useRef(0)
  const charIdxRef = useRef(DESCRIPTORS[0].length)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function step() {
      const phase = phaseRef.current
      const phrase = DESCRIPTORS[phraseIdxRef.current]

      if (phase === 'paused') {
        // Full text visible — wait, then highlight
        timer = setTimeout(() => {
          setHighlighted(true)
          phaseRef.current = 'highlighted'
          step()
        }, 2000)
      } else if (phase === 'highlighted') {
        // Text highlighted — clear all at once (like real select-all + delete)
        timer = setTimeout(() => {
          setHighlighted(false)
          setDisplayText('')
          charIdxRef.current = 0
          phraseIdxRef.current = (phraseIdxRef.current + 1) % DESCRIPTORS.length
          phaseRef.current = 'typing'
          step()
        }, 400)
      } else if (phase === 'typing') {
        const target = DESCRIPTORS[phraseIdxRef.current]
        if (charIdxRef.current < target.length) {
          timer = setTimeout(() => {
            charIdxRef.current++
            setDisplayText(target.slice(0, charIdxRef.current))
            step()
          }, 60)
        } else {
          // Done typing — pause
          phaseRef.current = 'paused'
          step()
        }
      }
    }

    step()
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
    setTiltX(-dy * 3)
    setTiltY( dx * 3)
  }, [])

  const handleMouseEnter = useCallback(() => setHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setTiltX(0)
    setTiltY(0)
  }, [])

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 8 },
        px: 2,
        background: isDark
          ? `linear-gradient(135deg, rgba(var(--theme-accent-rgb),0.03) 0%, rgba(var(--theme-accent-rgb),0.06) 50%, rgba(var(--theme-accent-rgb),0.03) 100%), linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)`
          : `linear-gradient(135deg, rgba(var(--theme-accent-rgb),0.04) 0%, rgba(var(--theme-accent-rgb),0.07) 50%, rgba(var(--theme-accent-rgb),0.04) 100%), linear-gradient(135deg, #dce8f5 0%, #f0f4f8 50%, #dce8f5 100%)`,
        borderBottom: `1px solid rgba(var(--theme-accent-rgb),${isDark ? 0.12 : 0.10})`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease, border-color 0.5s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: isDark
            ? `radial-gradient(ellipse at 60% 40%, rgba(var(--theme-accent-rgb),0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(var(--theme-accent-rgb),0.04) 0%, transparent 55%)`
            : `radial-gradient(ellipse at 60% 40%, rgba(var(--theme-accent-rgb),0.05) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(var(--theme-accent-rgb),0.03) 0%, transparent 55%)`,
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        },
      }}
    >
      {/* God light rays from above */}
      <GodLight />

      {/* Particle layer */}
      <ParticleCanvas height={320} />

      {/* Wave at bottom of header */}
      <WaveEffect position="bottom" />

      {/* Content — above effects */}
      <Box sx={{ position: 'relative', zIndex: 1, perspective: '900px' }}>
      <Box
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: 'inline-block',
          px: { xs: 3, md: 5 },
          py: { xs: 2.5, md: 3.5 },
          borderRadius: 3,
          background: isDark
            ? 'rgba(13,17,23,0.52)'
            : 'rgba(240,244,248,0.58)',
          backdropFilter: 'blur(4px) brightness(1.1)',
          WebkitBackdropFilter: 'blur(4px) brightness(1.1)',
          border: `1px solid rgba(var(--theme-accent-rgb),0.12)`,
          boxShadow: isDark
            ? `0 2px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)`
            : `0 2px 24px rgba(var(--theme-accent-rgb),0.08), inset 0 1px 0 rgba(255,255,255,0.70)`,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: hovered
            ? 'transform 0.10.5s ease'
            : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          willChange: 'transform',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
            background: (() => {
              if (!settings.pulsate) {
                return isDark
                  ? `linear-gradient(135deg, ${scheme.heading.dark[0]} 30%, ${scheme.heading.dark[1]} 100%)`
                  : `linear-gradient(135deg, ${scheme.heading.light[0]} 30%, ${scheme.heading.light[1]} 100%)`
              }
              const base = isDark ? scheme.heading.dark[0] : scheme.heading.light[0]
              const color = isDark ? scheme.heading.dark[1] : scheme.heading.light[1]
              // Seamless loop: base → color → base (repeated) with smooth transitions
              return `linear-gradient(90deg, ${base} 0%, ${color} 25%, ${accent} 50%, ${color} 75%, ${base} 100%)`
            })(),
            backgroundSize: settings.pulsate ? '200% 100%' : '100% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: settings.pulsate ? 'waveColor 4s linear infinite' : 'none',
            mb: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="h5"
          className={settings.pulsate ? 'pulsate-text' : undefined}
          sx={{
            color: 'var(--theme-primary)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            mb: 3,
            transition: 'color 0.5s ease',
            minHeight: '1.5em',
          }}
        >
          <Box
            component="span"
            sx={{
              ...(highlighted && {
                backgroundColor: 'var(--theme-primary)',
                color: isDark ? '#0d1117' : '#f0f4f8',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }),
              px: highlighted ? 0.5 : 0,
              borderRadius: 0.5,
            }}
          >
            {displayText}
          </Box>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '2px',
              height: '1.1em',
              verticalAlign: 'text-bottom',
              ml: 0.3,
              backgroundColor: 'var(--theme-primary)',
              animation: 'cursorBlink 0.8s step-end infinite',
              '@keyframes cursorBlink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0 },
              },
            }}
          />
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            color: 'text.secondary',
          }}
        >
          <ContactItem icon={<EmailIcon fontSize="small" />} label={contact.email} href={`mailto:${contact.email}`} tooltip="Email" isDark={isDark} accentRgb={accentRgb} />
          <ContactItem icon={<PhoneIcon fontSize="small" />} label={contact.phone} href={`tel:${contact.phone}`} tooltip="Phone" isDark={isDark} accentRgb={accentRgb} />
          <ContactItem icon={<GitHubIcon fontSize="small" />} label={contact.github} href={contact.githubUrl} tooltip="GitHub" external isDark={isDark} accentRgb={accentRgb} />
          <ContactItem icon={<LinkedInIcon fontSize="small" />} label={contact.linkedin} href={contact.linkedinUrl} tooltip="LinkedIn" external isDark={isDark} accentRgb={accentRgb} />
          <ContactItem icon={<LocationOnIcon fontSize="small" />} label={contact.location} href="https://www.google.com/maps/place/Texas,+USA" tooltip="Location" external isDark={isDark} accentRgb={accentRgb} />
        </Box>
      </Box>
      </Box>
    </Box>
  )
}

interface ContactItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  tooltip?: string
  external?: boolean
  isDark: boolean
  accentRgb: [number, number, number]
}

function ContactItem({ icon, label, href, external, isDark, accentRgb }: ContactItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        transition: 'all 0.2s',
        ...(href && {
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--theme-primary)',
            backgroundColor: `rgba(var(--theme-accent-rgb),0.08)`,
          },
        }),
      }}
      component={href ? 'a' : 'span'}
      {...(href && {
        href,
        ...(external && { target: '_blank', rel: 'noopener noreferrer' }),
        style: { textDecoration: 'none', color: 'inherit' },
      })}
    >
      {icon}
      <Typography variant="body2" sx={{ fontWeight: 400 }}>
        {label}
      </Typography>
    </Box>
  )
}
