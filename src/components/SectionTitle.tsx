import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

interface Props {
  title: string
  icon?: React.ReactNode
}

export default function SectionTitle({ title, icon }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon && (
          <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontSize: '0.95rem',
            color: 'text.secondary',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(48,54,61,0.8)' }} />
    </Box>
  )
}
