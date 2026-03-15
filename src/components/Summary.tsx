import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import SectionTitle from './SectionTitle'
import { resumeData } from '../data/resume'

export default function Summary() {
  return (
    <Box component="section">
      <SectionTitle title="Summary" icon={<PersonIcon />} />
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          pl: 0.5,
        }}
      >
        {resumeData.summary}
      </Typography>
    </Box>
  )
}
