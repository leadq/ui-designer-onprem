import { useEffect, useRef } from 'react'
import { Box, Button, Stack, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignAnnotation } from '@root/types/document'

import styles from './styles.module.scss'

const ANNOTATION_PREVIEW_LENGTH = 64

export interface AnnotationListProps {
  annotations: DesignAnnotation[]
  selectedId: string | null
  onSelect: (annotation: DesignAnnotation) => void
  onDelete: (annotation: DesignAnnotation) => void
  onNew: () => void
}

export const AnnotationList = ({
  annotations,
  selectedId,
  onSelect,
  onDelete,
  onNew,
}: AnnotationListProps) => {
  const { translate } = useBuilderI18n()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedId) {
      return
    }

    listRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  return (
    <Stack className={styles.annotationList} gap='sm'>
      <Box
        ref={listRef}
        aria-label={translate('annotation.list')}
        className={styles.annotationList__items}
        role='region'
        tabIndex={0}
      >
        {annotations.length === 0 && <Text color='muted'>{translate('annotation.empty')}</Text>}
        {annotations.map((annotation) => {
          const name = annotation.title || annotation.text.slice(0, ANNOTATION_PREVIEW_LENGTH)

          return (
            <Box key={annotation.id} className={styles.annotationList__item}>
              <Button
                aria-pressed={selectedId === annotation.id}
                className={styles.annotationList__select}
                variant={selectedId === annotation.id ? 'light' : 'ghost'}
                onClick={() => onSelect(annotation)}
              >
                {name}
              </Button>
              <Button
                aria-label={translate('annotation.deleteNamed', { name })}
                className={styles.annotationList__delete}
                size='sm'
                variant='ghost'
                onClick={() => onDelete(annotation)}
              >
                <EditorIcon aria-hidden name='close' size={15} />
              </Button>
            </Box>
          )
        })}
      </Box>
      <Button isFullWidth variant='outline' onClick={onNew}>
        {translate('annotation.new')}
      </Button>
    </Stack>
  )
}
