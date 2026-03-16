import { createContext, useContext, useState } from 'react'

export interface Settings {
  darkMode: boolean
  gaussian: boolean
  particles: boolean
  pulsate: boolean
  waves: boolean
  colorScheme: number // index into COLOR_SCHEMES
}

interface SettingsContextValue {
  settings: Settings
  toggle: (key: keyof Settings) => void
  setColorScheme: (index: number) => void
}

const defaults: Settings = {
  darkMode: true,
  gaussian: true,
  particles: true,
  pulsate: true,
  waves: true,
  colorScheme: 0,
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaults,
  toggle: () => {},
  setColorScheme: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults)

  const toggle = (key: keyof Settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))

  const setColorScheme = (index: number) =>
    setSettings((prev) => ({ ...prev, colorScheme: index }))

  return (
    <SettingsContext.Provider value={{ settings, toggle, setColorScheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
