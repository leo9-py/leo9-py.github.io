import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import WorkIcon from '@mui/icons-material/Work'
import SectionTitle from './SectionTitle'
import GlassCard from './effects/GlassCard'
import { resumeData } from '../data/resume'

export default function Experience() {
  return (
    <Box component="section">
      <SectionTitle title="Experience" icon={<WorkIcon />} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {resumeData.experience.map((job) => (
          <GlassCard key={job.company}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'flex-start' },
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                    {job.role}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'var(--theme-primary)', fontWeight: 500 }}>
                    {job.company}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
                  <Chip
                    label={`${job.start} – ${job.end}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: '0.75rem' }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.primary' }}>
                    {job.location}
                  </Typography>
                </Box>
              </Box>

              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {job.bullets.map((bullet, i) => (
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
