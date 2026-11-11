import { Box, Button } from '@root/components/common'
import { Tooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

import styles from './styles.module.scss'

export const OutlineModeButton = () => {
  const { translate } = useBuilderI18n()
  const mode = useEditorStore((state) => state.outlineMode)
  const cycleOutlineMode = useEditorStore((state) => state.cycleOutlineMode)
  const nextMode = mode === 'selection' ? 'layout' : mode === 'layout' ? 'parent' : 'selection'

  const hint = translate('header.outlines.hint', {
    current: translate(`header.outlines.${mode}`),
    next: translate(`header.outlines.${nextMode}`),
  })

  const handleCycleOutlineModeClick = cycleOutlineMode

  return (
    <Tooltip label={hint} position='bottom'>
      <Button
        aria-label={hint}
        className={styles.outlineModeButton}
        data-outline-mode={mode}
        size='sm'
        variant={mode === 'selection' ? 'ghost' : 'light'}
        onClick={handleCycleOutlineModeClick}
      >
        <Box aria-hidden='true' className={styles.outlineModeButton__icon}>
          <Box className={styles.outlineModeButton__selection} />
          {mode !== 'selection' && <Box className={styles.outlineModeButton__layout} />}
          {mode === 'parent' && <Box className={styles.outlineModeButton__parent} />}
        </Box>
      </Button>
    </Tooltip>
  )
}
