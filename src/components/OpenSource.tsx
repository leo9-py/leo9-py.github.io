import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import CodeIcon from '@mui/icons-material/Code'
import GitHubIcon from '@mui/icons-material/GitHub'
import SectionTitle from './SectionTitle'
import GlassCard from './effects/GlassCard'
import { resumeData } from '../data/resume'

export default function OpenSource() {
  return (
    <Box component="section">
      <SectionTitle title="Open Source" icon={<CodeIcon />} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {resumeData.openSource.map((project) => (
          <GlassCard key={project.name}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {project.name}
                  </Typography>
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--theme-primary)' }}
                  >
                    <GitHubIcon fontSize="small" />
                  </Link>
                </Box>
                <Chip
                  label={project.date}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>

              <Typography variant="subtitle2" sx={{ color: 'var(--theme-primary)', fontWeight: 500, display: 'block', mb: 1.5 }}>
                {project.stack}
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {project.bullets.map((bullet, i) => (
                  <Box
                    component="li"
                    key={i}
                    sx={{
                      mb: 0.75,
                      color: 'text.secondary',
                      '&::marker': { color: 'var(--theme-primary)' },
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      {bullet}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </GlassCard>
        ))}
      </Box>
    </Box>
  )
}
