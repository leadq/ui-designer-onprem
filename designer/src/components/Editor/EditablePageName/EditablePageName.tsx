import { useEffect, useRef, useState } from 'react'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { InputControl } from '@root/components/common/InputControl'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

import styles from './styles.module.scss'

const EditablePageName = () => {
  const { translate } = useBuilderI18n()
  const pageName = useEditorStore((state) => state.pageName)
  const setPageName = useEditorStore((state) => state.setPageName)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(pageName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()

      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setDraft(pageName)

    setIsEditing(true)
  }

  const handleConfirm = () => {
    const trimmed = draft.trim()

    if (trimmed) {
      setPageName(trimmed)
    }

    setIsEditing(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleConfirm()
    } else if (event.key === 'Escape') {
      setDraft(pageName)

      setIsEditing(false)
    }
  }

  if (isEditing) {
    const handleConfirmBlur = handleConfirm

    return (
      <div className={styles.editablePageName}>
        <InputControl
          ref={inputRef}
          className={styles.editablePageName__input}
          maxLength={60}
          value={draft}
          onBlur={handleConfirmBlur}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    )
  }

  const handleStartEditClick = handleStartEdit

  return (
    <div className={styles.editablePageName}>
      <EditorTooltip label={translate('pageName.rename')}>
        <ButtonBase
          aria-label={translate('pageName.rename')}
          className={styles.editablePageName__display}
          onClick={handleStartEditClick}
        >
          {pageName}
        </ButtonBase>
      </EditorTooltip>
    </div>
  )
}

export { EditablePageName }
