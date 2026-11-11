import { useState } from 'react'
import { Input, type InputProps } from '@root/components/common'

export interface SpacingInputProps extends Omit<
  InputProps,
  'value' | 'onChange' | 'onBlur' | 'onFocus'
> {
  value: string
  onChange: (value: string | undefined) => void
}

export const SpacingInput = ({ value, onChange, className = '', ...props }: SpacingInputProps) => {
  const [draft, setDraft] = useState<string | null>(null)

  const handleChange = (text: string) => {
    setDraft(text)

    const trimmed = text.trim()
    const normalized = /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed) ? `${Number(trimmed)}px` : trimmed

    onChange(normalized || undefined)
  }

  return (
    <Input
      {...props}
      className={`spacingInput ${className}`}
      value={draft ?? value}
      onBlur={() => setDraft(null)}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={() => setDraft(value)}
    />
  )
}
