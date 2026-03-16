import { useSettings } from '../context/SettingsContext'
import { COLOR_SCHEMES, type ColorScheme } from '../data/colorSchemes'

export function useColorScheme(): ColorScheme {
  const { settings } = useSettings()
  return COLOR_SCHEMES[settings.colorScheme] ?? COLOR_SCHEMES[0]
}
