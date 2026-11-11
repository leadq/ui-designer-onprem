import { useState } from 'react'
import { Box } from '@root/components/common/Box'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { Input } from '@root/components/common/Input'
import { Modal } from '@root/components/common/Modal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import type { TableTextDraft } from '../types'

import styles from './styles.module.scss'

interface TableTextEditorProps {
  draft: TableTextDraft
  onApply: (text: string) => void
  onCancel: () => void
}

export const TableTextEditor = ({ draft, onApply, onCancel }: TableTextEditorProps) => {
  const { translate } = useBuilderI18n()
  const [text, setText] = useState(draft.text)
  const handleApply = () => onApply(text)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      handleApply()
    }
  }

  const handleApplyClick = handleApply

  return (
    <Modal
      isOpen
      size='sm'
      title={
        draft.cellId
          ? translate('tableAuthoring.editCellText')
          : translate('tableAuthoring.editHeader')
      }
      onClose={onCancel}
    >
      <Box className={styles.tableTextEditor}>
        <Input
          autoFocus
          value={text}
          label={
            draft.cellId
              ? translate('tableAuthoring.cellText')
              : translate('tableAuthoring.headerText')
          }
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Box className={styles.tableTextEditor__actions}>
          <ButtonBase onClick={onCancel}>{translate('general.cancel')}</ButtonBase>
          <ButtonBase onClick={handleApplyClick}>{translate('tableAuthoring.apply')}</ButtonBase>
        </Box>
      </Box>
    </Modal>
  )
}
