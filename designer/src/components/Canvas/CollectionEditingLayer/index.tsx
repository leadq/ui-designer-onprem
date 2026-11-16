import { Box, ButtonBase } from '@root/components/common'
import { PositionedBox } from '@root/components/common/PositionedBox'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { COLLECTION_MAX_ITEMS } from '@root/utils/collectionAuthoring/constants'

import { useCollectionGeometry } from './hooks/useCollectionGeometry'

import styles from './styles.module.scss'

const HANDLE_GAP = 4
const EMPTY_GUIDE_COUNT = 4
const EMPTY_GUIDE_ROWS = Array.from({ length: EMPTY_GUIDE_COUNT }, (_, index) => index)
const EMPTY_GUIDE_ROW_HEIGHT = 40

export const CollectionEditingLayer = () => {
  const { translate } = useBuilderI18n()
  const { collection, geometry, zoom } = useCollectionGeometry()
  const edit = useEditorStore((state) => state.editCollection)
  const select = useEditorStore((state) => state.setSelectedNodeIds)

  if (!collection || !geometry) {
    return null
  }

  const isTabs = registry[collection.type].collection?.kind === 'tabs'
  const handleStop = (event: React.SyntheticEvent) => event.stopPropagation()
  const handleStopClick = handleStop
  const handleStopDoubleClick = handleStop
  const handleStopMouseDown = handleStop

  return (
    <Box
      data-collection-editor
      data-designer-chrome
      className={styles.collectionEditingLayer}
      onClick={handleStopClick}
      onDoubleClick={handleStopDoubleClick}
      onMouseDown={handleStopMouseDown}
    >
      {!isTabs && collection.children.length === 0
        ? EMPTY_GUIDE_ROWS.map((row) => (
            <PositionedBox
              key={row}
              className={styles.collectionEditingLayer__guide}
              bounds={{
                x: geometry.root.x,
                y: geometry.root.y + row * EMPTY_GUIDE_ROW_HEIGHT * zoom,
                width: geometry.root.width,
                height: EMPTY_GUIDE_ROW_HEIGHT * zoom,
              }}
            />
          ))
        : null}
      {geometry.triggers.map((trigger) => (
        <PositionedBox key={trigger.id} bounds={trigger.bounds}>
          <ButtonBase
            className={styles.collectionEditingLayer__trigger}
            aria-label={translate('collectionAuthoring.editTab', {
              title: String(
                collection.children.find((item) => item.id === trigger.id)?.props.label,
              ),
            })}
            onClick={() => select([trigger.id], trigger.id)}
          />
        </PositionedBox>
      ))}
      <PositionedBox
        scale={zoom}
        bounds={{
          x: geometry.root.x,
          y: geometry.root.y + geometry.root.height + HANDLE_GAP * zoom,
        }}
      >
        <ButtonBase
          className={styles.collectionEditingLayer__add}
          isDisabled={collection.children.length >= COLLECTION_MAX_ITEMS}
          onClick={() => edit(collection.id, { type: 'add' })}
        >
          {translate(
            isTabs
              ? 'collectionAuthoring.addTab'
              : collection.children.length
                ? 'collectionAuthoring.addCopy'
                : 'collectionAuthoring.firstItem',
          )}
        </ButtonBase>
      </PositionedBox>
    </Box>
  )
}
