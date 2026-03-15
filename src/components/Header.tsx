import { useRef, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useSettings } from '../context/SettingsContext'
import WaveEffect from './effects/WaveEffect'
import ParticleCanvas from './effects/ParticleCanvas'
import GodLight from './effects/GodLight'
import { resumeData } from '../data/resume'

const { name, title, contact } = resumeData

export default function Header() {
  const { settings } = useSettings()
  const isDark = settings.darkMode
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [hovered, setHovered] = useState(false)

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
          ? 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)'
          : 'linear-gradient(135deg, #dce8f5 0%, #f0f4f8 50%, #dce8f5 100%)',
        borderBottom: `1px solid ${isDark ? 'rgba(48,54,61,0.8)' : 'rgba(0,80,160,0.12)'}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.4s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: isDark
            ? 'radial-gradient(ellipse at 60% 40%, rgba(100,181,246,0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(206,147,216,0.04) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 60% 40%, rgba(0,80,160,0.05) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(123,31,162,0.03) 0%, transparent 55%)',
          pointerEvents: 'none',
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
          border: isDark
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,80,160,0.12)',
          boxShadow: isDark
            ? '0 2px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)'
            : '0 2px 24px rgba(0,80,160,0.08), inset 0 1px 0 rgba(255,255,255,0.70)',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: hovered
            ? 'transform 0.12s ease'
            : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          willChange: 'transform',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          className={settings.pulsate ? 'pulsate-heading' : undefined}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
            background: isDark
              ? 'linear-gradient(135deg, #e6edf3 30%, #64b5f6 100%)'
              : 'linear-gradient(135deg, #0a1929 30%, #0050a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="h5"
          className={settings.pulsate ? 'pulsate-text' : undefined}
          sx={{
            color: 'primary.main',
            fontWeight: 400,
            letterSpacing: '0.05em',
            mb: 3,
          }}
        >
          {title}
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
          <ContactItem icon={<EmailIcon fontSize="small" />} label={contact.email} href={`mailto:${contact.email}`} tooltip="Email" isDark={isDark} />
          <ContactItem icon={<PhoneIcon fontSize="small" />} label={contact.phone} href={`tel:${contact.phone}`} tooltip="Phone" isDark={isDark} />
          <ContactItem icon={<GitHubIcon fontSize="small" />} label={contact.github} href={contact.githubUrl} tooltip="GitHub" external isDark={isDark} />
          <ContactItem icon={<LinkedInIcon fontSize="small" />} label={contact.linkedin} href={contact.linkedinUrl} tooltip="LinkedIn" external isDark={isDark} />
          <ContactItem icon={<LocationOnIcon fontSize="small" />} label={contact.location} href="https://www.google.com/maps/place/Texas,+USA" tooltip="Location" external isDark={isDark} />
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
}

function ContactItem({ icon, label, href, external, isDark }: ContactItemProps) {
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
            color: 'primary.main',
            backgroundColor: isDark ? 'rgba(100,181,246,0.08)' : 'rgba(0,80,160,0.07)',
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
