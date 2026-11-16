import { InputControl } from '@root/components/common/InputControl'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

export interface SlotTemplateNameInputProps {
  templateName: string
  onChange: (name: string) => void
}

export const SlotTemplateNameInput = ({
  templateName,
  onChange: handleNameChange,
}: SlotTemplateNameInputProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--designer-border-color)',
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--designer-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {translate('slotBuilder.name')}
      </span>
      <InputControl
        placeholder={translate('slotBuilder.namePlaceholder')}
        type='text'
        value={templateName}
        style={{
          flex: 1,
          border: '1px solid var(--designer-border-color)',
          borderRadius: '4px',
          padding: '6px 10px',
          fontSize: '12px',
          background: 'var(--designer-bg-surface)',
          color: 'var(--designer-text-primary)',
          outline: 'none',
        }}
        onChange={(event) => handleNameChange(event.target.value)}
      />
    </div>
  )
}
