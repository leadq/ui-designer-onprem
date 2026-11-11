import { useState } from 'react'
import { Disclosure } from '@root/components/common/Disclosure'
import { IconPicker } from '@root/components/DesignIcons/IconPicker'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

export interface IconPropEditorProps {
  value: string
  onChange: (value: string) => void
}

export const IconPropEditor = ({ value, onChange }: IconPropEditorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = setIsOpen
  const { translate } = useBuilderI18n()

  return (
    <Disclosure isOpen={isOpen} label={translate('icons.choose')} onToggle={handleToggle}>
      {isOpen ? <IconPicker value={value} onChange={onChange} /> : null}
    </Disclosure>
  )
}
