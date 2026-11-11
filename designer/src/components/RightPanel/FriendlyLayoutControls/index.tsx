import { CSSProperties } from 'react'
import { Select, Stack } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

type LayoutMode = 'normal' | 'vertical' | 'horizontal' | 'grid'

const getLayoutMode = (style: CSSProperties): LayoutMode => {
  if (style.display === 'grid') {
    return 'grid'
  }

  if (style.display !== 'flex' && style.display !== 'inline-flex') {
    return 'normal'
  }

  return style.flexDirection === 'row' ? 'horizontal' : 'vertical'
}

const getLayoutStyle = (mode: LayoutMode): Partial<CSSProperties> => {
  if (mode === 'grid') {
    return { display: 'grid', flexDirection: undefined }
  }

  if (mode === 'horizontal') {
    return { display: 'flex', flexDirection: 'row' }
  }

  if (mode === 'vertical') {
    return { display: 'flex', flexDirection: 'column' }
  }

  return { display: 'block', flexDirection: undefined }
}

export interface FriendlyLayoutControlsProps {
  style: CSSProperties
  onChange: (style: Partial<CSSProperties>) => void
}

export const FriendlyLayoutControls = ({ style, onChange }: FriendlyLayoutControlsProps) => {
  const { translate } = useBuilderI18n()
  const layoutMode = getLayoutMode(style)
  const isFlexibleLayout = layoutMode === 'vertical' || layoutMode === 'horizontal'

  const gap =
    typeof style.gap === 'number' && style.gap !== 0 ? `${style.gap}px` : String(style.gap ?? '0')

  const gapOptions = [
    { value: '0', label: translate('layout.gap.none') },
    { value: '4px', label: translate('layout.gap.tight') },
    { value: '8px', label: translate('layout.gap.small') },
    { value: '16px', label: translate('layout.gap.normal') },
    { value: '24px', label: translate('layout.gap.large') },
    { value: '32px', label: translate('layout.gap.extraLarge') },
  ]

  if (!gapOptions.some((option) => option.value === gap)) {
    gapOptions.push({ value: gap, label: gap })
  }

  const handleLayoutModeChange = (value: string) => {
    onChange(getLayoutStyle(value as LayoutMode))
  }

  return (
    <Stack className={styles.friendlyLayoutControls} gap='sm'>
      <Select
        help={{ title: translate('layout.mode.label'), description: translate('layout.mode.help') }}
        label={translate('layout.mode.label')}
        value={layoutMode}
        data={[
          { value: 'normal', label: translate('layout.mode.normal') },
          { value: 'vertical', label: translate('layout.mode.vertical') },
          { value: 'horizontal', label: translate('layout.mode.horizontal') },
          ...(layoutMode === 'grid'
            ? [{ value: 'grid', label: translate('layout.mode.gridAdvanced'), disabled: true }]
            : []),
        ]}
        onChange={(event) => handleLayoutModeChange(event.target.value)}
      />

      {isFlexibleLayout ? (
        <>
          <Select
            label={translate('layout.alignment.label')}
            value={(style.alignItems as string) ?? 'stretch'}
            data={[
              { value: 'flex-start', label: translate('layout.alignment.start') },
              { value: 'center', label: translate('layout.alignment.center') },
              { value: 'flex-end', label: translate('layout.alignment.end') },
              { value: 'stretch', label: translate('layout.alignment.stretch') },
            ]}
            onChange={(event) => onChange({ alignItems: event.target.value })}
          />
          <Select
            label={translate('layout.distribution.label')}
            value={(style.justifyContent as string) ?? 'flex-start'}
            data={[
              { value: 'flex-start', label: translate('layout.distribution.start') },
              { value: 'center', label: translate('layout.distribution.center') },
              { value: 'flex-end', label: translate('layout.distribution.end') },
              { value: 'space-between', label: translate('layout.distribution.between') },
              { value: 'space-evenly', label: translate('layout.distribution.evenly') },
            ]}
            onChange={(event) => onChange({ justifyContent: event.target.value })}
          />
          <Select
            data={gapOptions}
            label={translate('layout.gap.label')}
            value={gap}
            onChange={(event) => onChange({ gap: event.target.value })}
          />
        </>
      ) : null}
    </Stack>
  )
}
