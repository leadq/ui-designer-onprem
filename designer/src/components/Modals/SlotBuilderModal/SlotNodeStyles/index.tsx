import { InputControl } from '@root/components/common/InputControl'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'

import styles from '../styles.module.scss'

export interface SlotNodeStylesProps {
  selectedNode: DesignNode
  onChange: (key: string, value: string) => void
}

export const SlotNodeStyles = ({
  selectedNode,
  onChange: handleStyleChange,
}: SlotNodeStylesProps) => {
  const { translate } = useBuilderI18n()

  return (
    <div className={styles.slotBuilderModal__section}>
      <div className={styles.slotBuilderModal__sectionTitle}>{translate('slotBuilder.styles')}</div>
      <div className={styles.slotBuilderModal__grid2}>
        <div className={styles.slotBuilderModal__propField}>
          <span className={styles.slotBuilderModal__propFieldLabel}>
            {translate('slotBuilder.padding')}
          </span>
          <InputControl
            className={styles.slotBuilderModal__propFieldInput}
            placeholder='e.g. 12px'
            type='text'
            value={selectedNode.style.padding ? String(selectedNode.style.padding) : ''}
            onChange={(event) => handleStyleChange('padding', event.target.value)}
          />
        </div>
        <div className={styles.slotBuilderModal__propField}>
          <span className={styles.slotBuilderModal__propFieldLabel}>
            {translate('slotBuilder.margin')}
          </span>
          <InputControl
            className={styles.slotBuilderModal__propFieldInput}
            placeholder='e.g. 8px'
            type='text'
            value={selectedNode.style.margin ? String(selectedNode.style.margin) : ''}
            onChange={(event) => handleStyleChange('margin', event.target.value)}
          />
        </div>
      </div>

      <div className={styles.slotBuilderModal__grid2}>
        <div className={styles.slotBuilderModal__propField}>
          <span className={styles.slotBuilderModal__propFieldLabel}>
            {translate('slotBuilder.width')}
          </span>
          <InputControl
            className={styles.slotBuilderModal__propFieldInput}
            placeholder='e.g. 100%'
            type='text'
            value={selectedNode.style.width ? String(selectedNode.style.width) : ''}
            onChange={(event) => handleStyleChange('width', event.target.value)}
          />
        </div>
        <div className={styles.slotBuilderModal__propField}>
          <span className={styles.slotBuilderModal__propFieldLabel}>
            {translate('slotBuilder.height')}
          </span>
          <InputControl
            className={styles.slotBuilderModal__propFieldInput}
            placeholder='e.g. auto'
            type='text'
            value={selectedNode.style.height ? String(selectedNode.style.height) : ''}
            onChange={(event) => handleStyleChange('height', event.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
