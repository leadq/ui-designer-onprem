import type { UIAdapter } from '@root/types/componentContract'

export const getAdapterBackgroundColor = (adapter: Pick<UIAdapter, 'backgroundColor' | 'colors'>) =>
  adapter.colors?.find(
    (color) => color.id === adapter.backgroundColor && color.usages.includes('backgroundColor'),
  )?.cssValue
