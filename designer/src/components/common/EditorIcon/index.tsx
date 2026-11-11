import { forwardRef, type SVGAttributes } from 'react'

import { EDITOR_ICONS } from './constants/editorIcons'

export type EditorIconName = keyof typeof EDITOR_ICONS

export interface EditorIconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  'children' | 'name' | 'stroke'
> {
  name: EditorIconName
  size?: number | string
  strokeWidth?: number
}

export const EditorIcon = forwardRef<SVGSVGElement, EditorIconProps>(
  (
    {
      name,
      size = 24,
      strokeWidth = 2,
      'aria-label': label,
      'aria-hidden': isHidden = !label,
      ...props
    },
    ref,
  ) => {
    const IconComponent = EDITOR_ICONS[name]

    return (
      <IconComponent
        ref={ref}
        aria-hidden={isHidden}
        aria-label={label}
        focusable={false}
        role={label ? 'img' : undefined}
        size={size}
        stroke={strokeWidth}
        {...props}
      />
    )
  },
)

EditorIcon.displayName = 'EditorIcon'
