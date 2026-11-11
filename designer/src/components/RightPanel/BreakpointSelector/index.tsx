import { Box, InfoPopover, Text } from '@root/components/common'
import { ViewportSelect } from '@root/components/Editor/ViewportSelect'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

import styles from './styles.module.scss'

export const BreakpointSelector = () => {
  const { translate } = useBuilderI18n()
  const activeBreakpoint = useEditorStore((state) => state.activeBreakpoint)
  const setActiveBreakpoint = useEditorStore((state) => state.setActiveBreakpoint)
  const handleSetActiveBreakpointChange = setActiveBreakpoint

  return (
    <Box className={styles.breakpointSelector}>
      <Box className={styles.breakpointSelector__heading}>
        <Text size='sm' weight={600}>
          {translate('responsive.helpTitle')}
        </Text>
        <InfoPopover icon='help' isTitleVisible={false} label={translate('responsive.helpTitle')}>
          <Text size='sm'>{translate('responsive.helpDescription')}</Text>
        </InfoPopover>
      </Box>
      <ViewportSelect value={activeBreakpoint} onChange={handleSetActiveBreakpointChange} />
    </Box>
  )
}
