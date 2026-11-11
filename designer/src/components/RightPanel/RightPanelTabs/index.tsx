import { ButtonBase } from '@root/components/common/ButtonBase'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from '../styles.module.scss'

export type RightPanelTab = 'props' | 'styles'

export interface RightPanelTabsProps {
  hasEditableProperties: boolean
  activeTab: RightPanelTab
  onChange: (tab: RightPanelTab) => void
}

export const RightPanelTabs = ({
  hasEditableProperties,
  activeTab,
  onChange: handleTabChange,
}: RightPanelTabsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.rightPanel__tabs}>
      <ButtonBase
        isDisabled={!hasEditableProperties}
        type='button'
        className={[
          styles.rightPanel__tab,
          activeTab === 'props' ? styles['rightPanel__tab--active'] : '',
        ].join(' ')}
        onClick={() => handleTabChange('props')}
      >
        {translate('rightPanel.content')}
      </ButtonBase>
      <ButtonBase
        type='button'
        className={[
          styles.rightPanel__tab,
          activeTab === 'styles' ? styles['rightPanel__tab--active'] : '',
        ].join(' ')}
        onClick={() => handleTabChange('styles')}
      >
        {translate('rightPanel.layout')}
      </ButtonBase>
    </div>
  )
}
