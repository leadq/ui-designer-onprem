import { useState } from 'react'
import { Box, Input, Stack, Text } from '@root/components/common'
import { InfoPopover } from '@root/components/common/InfoPopover'
import { DeleteDesignModal } from '@root/components/Modals/DeleteDesignModal'
import { SlotBuilderModal } from '@root/components/Modals/SlotBuilderModal/SlotBuilderModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { ComponentMeta } from '@root/types/componentContract'

import { PaletteItem } from '../PaletteItem'
import { SavedDesignItem } from '../SavedDesignItem'

import { useSavedDesignActions } from './hooks/useSavedDesignActions'

import styles from './styles.module.scss'

const getNormalizedSearchText = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const getSearchableText = (component: ComponentMeta) =>
  [
    component.type,
    component.displayName,
    component.category,
    ...(component.searchKeywords ?? []),
  ].join(' ')

export interface ComponentPaletteProps {
  components: ComponentMeta[]
}

export const ComponentPalette = ({ components }: ComponentPaletteProps) => {
  const { translate } = useBuilderI18n()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    savedDesigns,
    editingDesign,
    setEditingDesignId,
    handleApplyEdit,
    deletingDesign,
    setDeletingDesignId,
    deleteUseCount,
    handleConfirmDelete,
  } = useSavedDesignActions()

  const normalizedSearchTerm = getNormalizedSearchText(searchTerm)

  const filteredComponents = components.filter(
    (component) =>
      !component.collectionItem &&
      getNormalizedSearchText(getSearchableText(component)).includes(normalizedSearchTerm),
  )

  const filteredSavedDesigns = savedDesigns.filter((design) =>
    getNormalizedSearchText(design.name).includes(normalizedSearchTerm),
  )

  const categoryLabels: Record<ComponentMeta['category'], string> = {
    icons: translate('componentCategory.icons'),
    layout: translate('componentCategory.layout'),
    form: translate('componentCategory.form'),
    display: translate('componentCategory.display'),
    overlays: translate('componentCategory.overlays'),
  }

  const handleSetDeletingDesignIdDelete = setDeletingDesignId
  const handleSetEditingDesignIdEdit = setEditingDesignId
  const handleApplyEditApply = handleApplyEdit
  const handleConfirmDeleteConfirm = handleConfirmDelete

  return (
    <Stack className={styles.componentPalette} gap='md'>
      <Box className={styles.componentPalette__search}>
        <Input
          aria-label={translate('componentSearch.label')}
          label={translate('componentSearch.placeholder')}
          type='search'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <InfoPopover label={translate('componentSearch.help')}>
          <Text size='sm'>{translate('componentSearch.insertHint')}</Text>
          <Text size='sm'>{translate('savedDesign.emptyHint')}</Text>
        </InfoPopover>
      </Box>

      {filteredComponents.length === 0 && filteredSavedDesigns.length === 0 ? (
        <Text className={styles.componentPalette__emptyState} color='muted' size='xs'>
          {translate('componentSearch.empty')}
        </Text>
      ) : (
        <>
          {filteredSavedDesigns.length > 0 && (
            <Stack className={styles.componentPalette__category} gap='sm'>
              <Text className={styles.componentPalette__categoryLabel} color='muted' weight={700}>
                {translate('savedDesign.yours')}
              </Text>
              <Stack gap='sm'>
                {filteredSavedDesigns.map((design) => (
                  <SavedDesignItem
                    key={design.id}
                    design={design}
                    onDelete={handleSetDeletingDesignIdDelete}
                    onEdit={handleSetEditingDesignIdEdit}
                  />
                ))}
              </Stack>
            </Stack>
          )}
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryComponents = filteredComponents.filter(
              (component) => component.category === category,
            )

            if (categoryComponents.length === 0) {
              return null
            }

            return (
              <Stack key={category} className={styles.componentPalette__category} gap='sm'>
                <Text className={styles.componentPalette__categoryLabel} color='muted' weight={700}>
                  {label}
                </Text>
                <Box className={styles.componentPalette__grid}>
                  {categoryComponents.map((component) => (
                    <PaletteItem
                      key={component.type}
                      displayName={component.displayName}
                      type={component.type}
                    />
                  ))}
                </Box>
              </Stack>
            )
          })}
        </>
      )}

      <SlotBuilderModal
        isMultiple
        initialName={editingDesign?.name ?? ''}
        isOpened={Boolean(editingDesign)}
        slotNodes={editingDesign?.nodes ?? []}
        title={translate('savedDesign.editTitle', { name: editingDesign?.name ?? '' })}
        onApply={handleApplyEditApply}
        onClose={() => setEditingDesignId(null)}
      />
      {deletingDesign ? (
        <DeleteDesignModal
          design={deletingDesign}
          useCount={deleteUseCount}
          onClose={() => setDeletingDesignId(null)}
          onConfirm={handleConfirmDeleteConfirm}
        />
      ) : null}
    </Stack>
  )
}
