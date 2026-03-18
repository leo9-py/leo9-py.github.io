import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import CardContent from '@mui/material/CardContent'
import BuildIcon from '@mui/icons-material/Build'
import SectionTitle from './SectionTitle'
import GlassCard from './effects/GlassCard'
import { resumeData } from '../data/resume'
import { useSettings } from '../context/SettingsContext'
import { useColorScheme } from '../hooks/useColorScheme'

const categoryColors: Record<string, 'primary' | 'secondary' | 'custom'> = {
  'Languages & Frameworks': 'primary',
  'Tools & Platforms': 'secondary',
  'Practices': 'custom',
}

export default function Skills() {
  const { settings } = useSettings()
  const scheme = useColorScheme()
  const isDark = settings.darkMode
  const practiceColor = isDark ? scheme.tertiary.dark : scheme.tertiary.light

  return (
    <Box component="section">
      <SectionTitle title="Skills" icon={<BuildIcon />} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(resumeData.skills).map(([category, items]) => {
          const cat = categoryColors[category] ?? 'primary'
          return (
            <GlassCard key={category}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
                <Typography
                  variant="overline"
                  sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.08em', display: 'block', mb: 1.5 }}
                >
                  {category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {items.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      color={cat !== 'custom' ? cat : undefined}
                      variant="outlined"
                      sx={{
                        fontSize: '0.8rem',
                        height: 28,
                        ...(cat === 'custom' && {
                          borderColor: `${practiceColor}4d`,
                          color: practiceColor,
                          transition: 'color 0.5s ease, border-color 0.5s ease',
                        }),
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </GlassCard>
          )
        })}
      </Box>
    </Box>
  )
}
