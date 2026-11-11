import { useState } from 'react'
import { Box, Button, Modal, Stack, Text, Tooltip } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export const ShortcutsButton = () => {
  const { translate } = useBuilderI18n()
  const [isOpen, setIsOpen] = useState(false)
  const modifier = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'

  const groups = [
    {
      title: 'shortcuts.edit',
      items: [
        ['header.undo', `${modifier} + Z`],
        ['header.redo', `${modifier} + Shift + Z / ${modifier} + Y`],
        ['context.copy', `${modifier} + C`],
        ['context.paste', `${modifier} + V`],
        ['context.duplicate', `${modifier} + D`],
        ['context.delete', `Delete / ${modifier} + Backspace`],
        ['shortcuts.moveUp', `${modifier} + ↑`],
        ['shortcuts.moveDown', `${modifier} + ↓`],
      ],
    },
    {
      title: 'shortcuts.selection',
      items: [
        ['shortcuts.multiSelect', `${modifier} + ${translate('shortcuts.click')}`],
        ['shortcuts.enterGroup', translate('shortcuts.doubleClick')],
        ['shortcuts.exitGroup', 'Esc'],
      ],
    },
    {
      title: 'shortcuts.workspace',
      items: [
        ['shortcuts.pan', `${translate('shortcuts.space')} + ${translate('shortcuts.drag')}`],
        ['shortcuts.middlePan', translate('shortcuts.middleDrag')],
        ['shortcuts.horizontal', `Shift + ${translate('shortcuts.wheel')}`],
        ['shortcuts.zoom', `${modifier} + ${translate('shortcuts.wheel')}`],
        ['shortcuts.nativeMenu', `Ctrl + ${translate('shortcuts.rightClick')}`],
      ],
    },
    {
      title: 'shortcuts.controls',
      items: [
        ['shortcuts.navigate', 'Tab / Shift + Tab'],
        ['shortcuts.menu', '↑ / ↓ / ← / → / Home / End'],
        ['shortcuts.activate', `Enter / ${translate('shortcuts.space')}`],
        ['shortcuts.close', 'Esc'],
      ],
    },
  ] as const

  return (
    <>
      <Tooltip label={translate('shortcuts.title')}>
        <Button
          aria-label={translate('shortcuts.title')}
          size='sm'
          variant='ghost'
          onClick={(event) => {
            // Safari does not focus a button on pointer activation; remember the real opener.
            event.currentTarget.focus({ preventScroll: true })

            setIsOpen(true)
          }}
        >
          <EditorIcon aria-hidden name='keyboard' size={18} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        size='md'
        title={translate('shortcuts.title')}
        onClose={() => setIsOpen(false)}
      >
        <Stack className={styles.shortcutsButton} gap='lg'>
          <Text color='secondary'>{translate('shortcuts.scope')}</Text>
          {groups.map((group) => (
            <Box key={group.title}>
              <Text className={styles.shortcutsButton__heading} weight={600}>
                {translate(group.title)}
              </Text>
              {group.items.map(([label, keys]) => (
                <Box key={label} className={styles.shortcutsButton__row}>
                  <Text>{translate(label)}</Text>
                  <Text className={styles.shortcutsButton__keys}>{keys}</Text>
                </Box>
              ))}
            </Box>
          ))}
        </Stack>
      </Modal>
    </>
  )
}
