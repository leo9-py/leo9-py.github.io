import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import SchoolIcon from '@mui/icons-material/School'
import StarIcon from '@mui/icons-material/Star'
import SectionTitle from './SectionTitle'
import GlassCard from './effects/GlassCard'
import { resumeData } from '../data/resume'

export default function Education() {
  return (
    <Box component="section">
      <SectionTitle title="Education" icon={<SchoolIcon />} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {resumeData.education.map((edu) => (
          <GlassCard key={edu.school}>
            <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 500, mt: 0.25 }}>
                    {edu.school}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {edu.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.75 }}>
                  <Chip
                    label={edu.date}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: 'rgba(100,181,246,0.3)', color: 'text.secondary', fontSize: '0.75rem' }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                      GPA {edu.gpa}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </GlassCard>
        ))}
      </Box>
    </Box>
  )
}
