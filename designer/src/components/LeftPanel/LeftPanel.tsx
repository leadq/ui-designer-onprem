import { useState } from 'react'
import { getAdapter } from '@root/adapters'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'

import { Button } from '../common'
import { ButtonBase } from '../common/ButtonBase'
import { AdapterSelector } from '../Editor/AdapterSelector'
import { FlowPanel } from '../Flows/FlowPanel'

import { ComponentPalette } from './ComponentPalette'
import { ComponentTree } from './ComponentTree'

import styles from './LeftPanel.module.scss'

type LeftPanelTab = 'add' | 'tree' | 'flows'

interface LeftPanelProps {
  isCollapsed?: boolean
}

const LeftPanel = ({ isCollapsed }: LeftPanelProps) => {
  const { translate } = useBuilderI18n()
  const adapterId = useEditorStore((state) => state.adapterId)
  const [activeTab, setActiveTab] = useState<LeftPanelTab>('add')

  return (
    <div
      className={[styles.leftPanel, isCollapsed ? styles['leftPanel--collapsed'] : ''].join(' ')}
    >
      <div className={styles.leftPanel__logoContainer}>
        {isCollapsed ? (
          <div className={styles.leftPanel__logoIcon}>UI</div>
        ) : (
          <div className={styles.leftPanel__logoText}>
            <span className={styles.leftPanel__logoTextPrimary}>UI</span>
            <span className={styles.leftPanel__logoTextSecondary}>Designer</span>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          <AdapterSelector />
          <div className={styles.leftPanel__tabs}>
            <ButtonBase
              className={[
                styles.leftPanel__tab,
                activeTab === 'add' ? styles['leftPanel__tab--active'] : '',
              ].join(' ')}
              onClick={() => setActiveTab('add')}
            >
              {translate('leftPanel.add')}
            </ButtonBase>
            <ButtonBase
              className={[
                styles.leftPanel__tab,
                activeTab === 'tree' ? styles['leftPanel__tab--active'] : '',
              ].join(' ')}
              onClick={() => setActiveTab('tree')}
            >
              {translate('leftPanel.pageTree')}
            </ButtonBase>
            <Button
              aria-pressed={activeTab === 'flows'}
              variant='ghost'
              className={[
                styles.leftPanel__tab,
                activeTab === 'flows' ? styles['leftPanel__tab--active'] : '',
              ].join(' ')}
              onClick={() => setActiveTab('flows')}
            >
              {translate('flow.title')}
            </Button>
          </div>

          <div className={styles.leftPanel__content}>
            {activeTab === 'flows' && <FlowPanel />}
            {activeTab === 'add' && (
              <ComponentPalette components={Object.values(getAdapter(adapterId).registry)} />
            )}

            {activeTab === 'tree' && <ComponentTree />}
          </div>
        </>
      )}
    </div>
  )
}

export { LeftPanel }
