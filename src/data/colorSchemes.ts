export interface ColorScheme {
  name: string
  /** Primary accent — used for links, headings, active states */
  primary: { dark: string; light: string }
  /** Secondary accent — used for subtle highlights */
  secondary: { dark: string; light: string }
  /** Swatch color shown in the settings panel */
  swatch: string
  /** God light tint in dark mode [r,g,b] */
  glow: { dark: [number, number, number]; light: [number, number, number] }
  /** Particle color in dark mode */
  particle: { dark: string; light: string }
  /** Tertiary accent — used for third category (e.g. Practices chips) */
  tertiary: { dark: string; light: string }
  /** Wave body tint */
  wave: { dark: string; light: string }
  /** Header gradient name heading — from / to */
  heading: { dark: [string, string]; light: [string, string] }
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: 'Original',
    primary: { dark: '#64b5f6', light: '#0050a0' },
    secondary: { dark: '#ce93d8', light: '#7b1fa2' },
    tertiary: { dark: '#81c784', light: '#388e3c' },
    swatch: '#64b5f6',
    glow: { dark: [80, 140, 220], light: [255, 235, 170] },
    particle: { dark: '#64b5f6', light: '#0050a0' },
    wave: { dark: 'rgba(100,181,246,', light: 'rgba(0,80,160,' },
    heading: { dark: ['#e6edf3', '#64b5f6'], light: ['#0a1929', '#0050a0'] },
  },
  {
    name: 'Yellow',
    primary: { dark: '#ffd54f', light: '#a67c00' },
    secondary: { dark: '#f48fb1', light: '#c2185b' },
    tertiary: { dark: '#4dd0e1', light: '#00838f' },
    swatch: '#ffd54f',
    glow: { dark: [220, 190, 60], light: [255, 230, 120] },
    particle: { dark: '#ffd54f', light: '#a67c00' },
    wave: { dark: 'rgba(255,213,79,', light: 'rgba(166,124,0,' },
    heading: { dark: ['#e6edf3', '#ffd54f'], light: ['#0a1929', '#a67c00'] },
  },
  {
    name: 'Green',
    primary: { dark: '#66bb6a', light: '#2e7d32' },
    secondary: { dark: '#ba68c8', light: '#7b1fa2' },
    tertiary: { dark: '#ffb74d', light: '#e65100' },
    swatch: '#66bb6a',
    glow: { dark: [60, 180, 80], light: [180, 230, 140] },
    particle: { dark: '#66bb6a', light: '#2e7d32' },
    wave: { dark: 'rgba(102,187,106,', light: 'rgba(46,125,50,' },
    heading: { dark: ['#e6edf3', '#66bb6a'], light: ['#0a1929', '#2e7d32'] },
  },
  {
    name: 'Pink',
    primary: { dark: '#f06292', light: '#c2185b' },
    secondary: { dark: '#ffd54f', light: '#f9a825' },
    tertiary: { dark: '#4fc3f7', light: '#0277bd' },
    swatch: '#f06292',
    glow: { dark: [220, 60, 130], light: [255, 180, 200] },
    particle: { dark: '#f06292', light: '#c2185b' },
    wave: { dark: 'rgba(240,98,146,', light: 'rgba(194,24,91,' },
    heading: { dark: ['#e6edf3', '#f06292'], light: ['#0a1929', '#c2185b'] },
  },
  {
    name: 'Purple',
    primary: { dark: '#b388ff', light: '#6a1b9a' },
    secondary: { dark: '#4dd0e1', light: '#00838f' },
    tertiary: { dark: '#ffcc80', light: '#e65100' },
    swatch: '#b388ff',
    glow: { dark: [140, 80, 220], light: [200, 160, 255] },
    particle: { dark: '#b388ff', light: '#6a1b9a' },
    wave: { dark: 'rgba(179,136,255,', light: 'rgba(106,27,154,' },
    heading: { dark: ['#e6edf3', '#b388ff'], light: ['#0a1929', '#6a1b9a'] },
  },
  {
    name: 'Cyan',
    primary: { dark: '#4dd0e1', light: '#00838f' },
    secondary: { dark: '#ffb74d', light: '#e65100' },
    tertiary: { dark: '#ef9a9a', light: '#c62828' },
    swatch: '#4dd0e1',
    glow: { dark: [40, 190, 210], light: [140, 230, 240] },
    particle: { dark: '#4dd0e1', light: '#00838f' },
    wave: { dark: 'rgba(77,208,225,', light: 'rgba(0,131,143,' },
    heading: { dark: ['#e6edf3', '#4dd0e1'], light: ['#0a1929', '#00838f'] },
  },
  {
    name: 'Blue',
    primary: { dark: '#5c6bc0', light: '#1a237e' },
    secondary: { dark: '#ff8a65', light: '#d84315' },
    tertiary: { dark: '#a5d6a7', light: '#2e7d32' },
    swatch: '#5c6bc0',
    glow: { dark: [60, 80, 180], light: [140, 160, 240] },
    particle: { dark: '#5c6bc0', light: '#1a237e' },
    wave: { dark: 'rgba(92,107,192,', light: 'rgba(26,35,126,' },
    heading: { dark: ['#e6edf3', '#5c6bc0'], light: ['#0a1929', '#1a237e'] },
  },
  {
    name: 'Magenta',
    primary: { dark: '#ea80fc', light: '#aa00ff' },
    secondary: { dark: '#ffd54f', light: '#f9a825' },
    tertiary: { dark: '#80cbc4', light: '#00695c' },
    swatch: '#ea80fc',
    glow: { dark: [200, 80, 240], light: [240, 160, 255] },
    particle: { dark: '#ea80fc', light: '#aa00ff' },
    wave: { dark: 'rgba(234,128,252,', light: 'rgba(170,0,255,' },
    heading: { dark: ['#e6edf3', '#ea80fc'], light: ['#0a1929', '#aa00ff'] },
  },
  {
    name: 'Orange',
    primary: { dark: '#ffa726', light: '#e65100' },
    secondary: { dark: '#ce93d8', light: '#7b1fa2' },
    tertiary: { dark: '#90caf9', light: '#1565c0' },
    swatch: '#ffa726',
    glow: { dark: [220, 140, 30], light: [255, 200, 120] },
    particle: { dark: '#ffa726', light: '#e65100' },
    wave: { dark: 'rgba(255,167,38,', light: 'rgba(230,81,0,' },
    heading: { dark: ['#e6edf3', '#ffa726'], light: ['#0a1929', '#e65100'] },
  },
  {
    name: 'Brown',
    primary: { dark: '#a1887f', light: '#4e342e' },
    secondary: { dark: '#66bb6a', light: '#2e7d32' },
    tertiary: { dark: '#81d4fa', light: '#0277bd' },
    swatch: '#8d6e63',
    glow: { dark: [140, 100, 70], light: [200, 170, 130] },
    particle: { dark: '#a1887f', light: '#4e342e' },
    wave: { dark: 'rgba(161,136,127,', light: 'rgba(78,52,46,' },
    heading: { dark: ['#e6edf3', '#a1887f'], light: ['#0a1929', '#4e342e'] },
  },
  {
    name: 'Red',
    primary: { dark: '#ef5350', light: '#b71c1c' },
    secondary: { dark: '#ffd54f', light: '#f9a825' },
    tertiary: { dark: '#a5d6a7', light: '#2e7d32' },
    swatch: '#ef5350',
    glow: { dark: [220, 50, 50], light: [255, 140, 140] },
    particle: { dark: '#ef5350', light: '#b71c1c' },
    wave: { dark: 'rgba(239,83,80,', light: 'rgba(183,28,28,' },
    heading: { dark: ['#e6edf3', '#ef5350'], light: ['#0a1929', '#b71c1c'] },
  },
]
