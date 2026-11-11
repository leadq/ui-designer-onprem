import { Box, Button, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import type { SlotComponent } from '@root/types/document'

import styles from './styles.module.scss'

export interface CellDesignerPaletteProps {
  saved: SlotComponent[]
  onAdd: (type: string) => void
  onSaved: (id: string) => void
}

export const CellDesignerPalette = ({ saved, onAdd, onSaved }: CellDesignerPaletteProps) => {
  const { translate } = useBuilderI18n()

  const palette = Object.values(registry).filter(
    (meta) => !meta.overlay && !meta.collectionItem && !meta.type.startsWith('designer'),
  )

  return (
    <Box className={styles.cellDesignerPalette}>
      <Text weight={600}>{translate('cellDesigner.components')}</Text>
      {saved.map((item) => (
        <Button
          key={item.id}
          draggable
          size='sm'
          variant='light'
          onClick={() => onSaved(item.id)}
          onDragStart={(event) =>
            event.dataTransfer.setData(
              'application/x-cell-designer',
              JSON.stringify({ savedId: item.id }),
            )
          }
        >
          {item.name}
        </Button>
      ))}
      {palette.map((meta) => (
        <Button
          key={meta.type}
          draggable
          data-cell-palette={meta.type}
          size='sm'
          variant='outline'
          onClick={() => onAdd(meta.type)}
          onDragStart={(event) =>
            event.dataTransfer.setData(
              'application/x-cell-designer',
              JSON.stringify({ type: meta.type }),
            )
          }
        >
          {meta.displayName}
        </Button>
      ))}
    </Box>
  )
}
