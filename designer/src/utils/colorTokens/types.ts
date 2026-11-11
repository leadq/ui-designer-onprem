export type ColorProperty = 'backgroundColor' | 'color' | 'borderColor'

export interface ColorToken {
  id: string
  label: string
  group: string
  cssValue: string
  sass?: { variable: string; importPath: string }
  usages: ColorProperty[]
}

export type StyleTokens = Partial<Record<ColorProperty, string>>
