import { ButtonBase } from '@root/components/common/ButtonBase'
import { SelectControl } from '@root/components/common/SelectControl'
import { SlotBuilderModal } from '@root/components/Modals/SlotBuilderModal/SlotBuilderModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { useSlotEditor } from './hooks/useSlotEditor'
import { SimpleHierarchyPreview } from './SimpleHierarchyPreview'

import styles from './styles.module.scss'

interface SlotEditorProps {
  parentNodeId: string
  slotKey: string
  label: string
  description?: string
  isMultiple?: boolean
}

const SlotEditor = ({
  parentNodeId,
  slotKey,
  label,
  description,
  isMultiple = true,
}: SlotEditorProps) => {
  const { translate } = useBuilderI18n()

  const {
    isBuilderOpen,
    isCreatingNew,
    slotComponents,
    selectedComponentId,
    boundComponent,
    handleSelectComponent,
    handleOpenEditClick,
    handleOpenCreateClick,
    handleApplyComponentApply,
    handleCloseBuilder: handleBuilderClose,
  } = useSlotEditor(parentNodeId, slotKey)

  return (
    <div className={styles.slotEditor}>
      <div className={styles.slotEditor__header}>
        <div className={styles.slotEditor__headerLeft}>
          <span className={styles.slotEditor__headerIcon}>🧩</span>
          <span className={styles.slotEditor__headerLabel}>{label}</span>
        </div>
        <span className={styles.slotEditor__headerBadge}>
          {boundComponent ? translate('slot.linked') : translate('slot.unlinked')}
        </span>
      </div>

      {description ? <div className={styles.slotEditor__description}>{description}</div> : null}

      <div className={styles.slotEditor__body}>
        {/* Dropdown Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {translate('slot.select')}
          </span>
          <SelectControl
            className={styles.slotEditor__select}
            value={selectedComponentId || ''}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '11px',
              outline: 'none',
              cursor: 'pointer',
            }}
            onChange={(event) => handleSelectComponent(event.target.value)}
          >
            <option value=''>-- {translate('slot.none')} --</option>
            {slotComponents.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </SelectControl>
        </div>

        {/* Bound slot component preview */}
        {boundComponent ? (
          <div className={styles.slotEditor__previewBox}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--primary)',
                marginBottom: '8px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '4px',
              }}
            >
              {translate('slot.preview', { name: boundComponent.name })}
            </div>
            <SimpleHierarchyPreview nodes={boundComponent.nodes} />
          </div>
        ) : (
          <div className={styles.slotEditor__empty}>{translate('slot.empty')}</div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {boundComponent ? (
            <ButtonBase
              className={styles.slotEditor__designBtn}
              style={{ flex: 1 }}
              type='button'
              onClick={handleOpenEditClick}
            >
              <span className={styles.slotEditor__designBtnIcon}>🎨</span>
              {translate('slot.edit')}
            </ButtonBase>
          ) : null}
          <ButtonBase
            className={styles.slotEditor__designBtn}
            type='button'
            style={{
              flex: 1,
              borderStyle: boundComponent ? 'solid' : 'dashed',
              background: boundComponent
                ? 'rgba(var(--primary-rgb), 0.02)'
                : 'rgba(var(--primary-rgb), 0.05)',
            }}
            onClick={handleOpenCreateClick}
          >
            <span className={styles.slotEditor__designBtnIcon}>+</span>
            {translate('slot.new')}
          </ButtonBase>
        </div>
      </div>

      <SlotBuilderModal
        initialName={!isCreatingNew && boundComponent ? boundComponent.name : ''}
        isMultiple={isMultiple}
        isOpened={isBuilderOpen}
        slotNodes={!isCreatingNew && boundComponent ? boundComponent.nodes : []}
        title={
          isCreatingNew
            ? translate('slot.createTitle')
            : translate('slot.editTitle', { name: boundComponent?.name ?? '' })
        }
        onApply={handleApplyComponentApply}
        onClose={handleBuilderClose}
      />
    </div>
  )
}

export { SlotEditor }

export type { SlotEditorProps }
