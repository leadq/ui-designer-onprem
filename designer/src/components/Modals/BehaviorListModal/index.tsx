import { useEffect, useMemo, useState } from 'react'
import { Button, Group, Input, Modal, Stack, Text } from '@root/components/common'
import type { BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getBehaviorEntries } from '@root/utils/getBehaviorEntries'

import styles from './styles.module.scss'

export interface BehaviorListModalProps {
  isOpen: boolean
  onClose: () => void
}

const getNormalizeSearchText = (value: string): string =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const BehaviorListModal = ({ isOpen: opened, onClose }: BehaviorListModalProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const pageName = useEditorStore((state) => state.pageName)
  const pageNotes = useEditorStore((state) => state.pageNotes)
  const pageAnnotations = useEditorStore((state) => state.pageAnnotations)
  const setSelectedNodeIds = useEditorStore((state) => state.setSelectedNodeIds)
  const [query, setQuery] = useState('')
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)

  const entries = useMemo(
    () => getBehaviorEntries(nodes, pageName, pageNotes, pageAnnotations),
    [nodes, pageName, pageNotes, pageAnnotations],
  )

  const filteredEntries = useMemo(() => {
    const normalizedQuery = getNormalizeSearchText(query.trim())

    if (!normalizedQuery) {
      return entries
    }

    return entries.filter((entry) =>
      getNormalizeSearchText(
        [
          entry.targetName,
          entry.componentType,
          entry.path,
          entry.text,
          entry.title ?? '',
          entry.annotationKind,
        ].join(' '),
      ).includes(normalizedQuery),
    )
  }, [entries, query])

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedEntryId) ?? filteredEntries[0] ?? null

  useEffect(() => {
    if (!opened) {
      return
    }

    setQuery('')

    setSelectedEntryId(entries[0]?.id ?? null)
  }, [entries, opened])

  const handleGoToNode = () => {
    if (!selectedEntry?.nodeId) {
      return
    }

    const nodeId = selectedEntry.nodeId

    setSelectedNodeIds([nodeId])

    onClose()

    requestAnimationFrame(() => {
      document.querySelector(`.design-node-${nodeId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    })
  }

  const handleGoToNodeClick = handleGoToNode

  return (
    <Modal isOpen={opened} size='xl' title={translate('behaviors.title')} onClose={onClose}>
      <Stack className={styles.behaviorListModal} gap='md'>
        {entries.length > 0 && (
          <Input
            autoFocus
            label={translate('behaviors.searchLabel')}
            placeholder={translate('behaviors.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        )}

        {entries.length === 0 ? (
          <Text className={styles.behaviorListModal__empty} color='muted'>
            {translate('behaviors.empty')}
          </Text>
        ) : (
          <Group align='stretch' className={styles.behaviorListModal__content}>
            <Stack className={styles.behaviorListModal__list} gap='xs'>
              {filteredEntries.map((entry) => (
                <Button
                  key={entry.id}
                  className={styles.behaviorListModal__item}
                  variant={selectedEntry?.id === entry.id ? 'light' : 'ghost'}
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <Text weight={600}>{entry.excerpt}</Text>
                  <Text color='muted' size='xs'>
                    {entry.targetName} · {entry.componentType}
                  </Text>
                </Button>
              ))}
              {filteredEntries.length === 0 && (
                <Text className={styles.behaviorListModal__empty} color='muted'>
                  {translate('behaviors.noResults')}
                </Text>
              )}
            </Stack>

            <Stack className={styles.behaviorListModal__detail} gap='sm'>
              {selectedEntry ? (
                <>
                  <Text color='muted' size='xs'>
                    {selectedEntry.path}
                  </Text>
                  <Text color='muted' size='xs'>
                    {translate(
                      `annotation.kind.${selectedEntry.annotationKind}` as BuilderTranslationKey,
                    )}
                  </Text>
                  <Text className={styles.behaviorListModal__fullText}>{selectedEntry.text}</Text>
                  {selectedEntry.nodeId ? (
                    <Button onClick={handleGoToNodeClick}>{translate('behaviors.goToNode')}</Button>
                  ) : null}
                </>
              ) : (
                <Text color='muted'>{translate('behaviors.selectHint')}</Text>
              )}
            </Stack>
          </Group>
        )}
      </Stack>
    </Modal>
  )
}
