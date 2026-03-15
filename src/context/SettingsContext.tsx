import { createContext, useContext, useState } from 'react'

export interface Settings {
  darkMode: boolean
  gaussian: boolean
  particles: boolean
  pulsate: boolean
  waves: boolean
}

interface SettingsContextValue {
  settings: Settings
  toggle: (key: keyof Settings) => void
}

const defaults: Settings = {
  darkMode: true,
  gaussian: true,
  particles: true,
  pulsate: false,
  waves: true,
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaults,
  toggle: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaults)

  const toggle = (key: keyof Settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <SettingsContext.Provider value={{ settings, toggle }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
