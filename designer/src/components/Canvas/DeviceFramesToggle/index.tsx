import { useResponsiveViewStore } from '@root/components/Canvas/stores/responsiveViewStore'
import { Box, Switch } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export const DeviceFramesToggle = () => {
  const { translate } = useBuilderI18n()
  const isVisible = useResponsiveViewStore((state) => state.areDeviceFramesVisible)
  const handleChange = useResponsiveViewStore((state) => state.setDeviceFramesVisible)

  return (
    <Tooltip label={translate('responsive.deviceFramesHelp')}>
      <Box className={styles.deviceFramesToggle} tabIndex={0}>
        <EditorIcon aria-hidden name='devices' size={18} />
        <Switch
          ariaLabel={translate('responsive.deviceFrames')}
          isChecked={isVisible}
          onChange={handleChange}
        />
      </Box>
    </Tooltip>
  )
}
