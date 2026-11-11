import { Group, Input, Stack, Text } from '@root/components/common'
import { Textarea } from '@root/components/common/Textarea'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { AnnotationDraft } from '@root/types/annotationDraft'

import styles from './styles.module.scss'

export interface AnnotationDraftFormProps {
  draft: AnnotationDraft
  isPageAnnotation: boolean
  onChange: (draft: AnnotationDraft) => void
}

const MAX_NOTE_LENGTH = 2000

export const AnnotationDraftForm = ({
  draft,
  isPageAnnotation,
  onChange,
}: AnnotationDraftFormProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Stack className={styles.annotationDraftForm} gap='sm'>
      <Input
        label={translate('annotation.title')}
        placeholder={translate('annotation.titlePlaceholder')}
        value={draft.title}
        onChange={(event) => onChange({ ...draft, title: event.target.value })}
      />
      <Text>{translate('annotation.description')}</Text>
      <Textarea
        aria-label={translate('annotation.description')}
        className={styles.annotationDraftForm__textarea}
        maxLength={MAX_NOTE_LENGTH}
        rows={7}
        value={draft.text}
        placeholder={translate(
          isPageAnnotation ? 'behavior.pagePlaceholder' : 'behavior.componentPlaceholder',
        )}
        onChange={(event) => onChange({ ...draft, text: event.target.value })}
      />
      <Group align='center' justify='between'>
        <Text color='muted' size='xs'>
          {draft.text.length} / {MAX_NOTE_LENGTH}
        </Text>
        <Text color='muted' size='xs'>
          {translate('behavior.exportHint')}
        </Text>
      </Group>
    </Stack>
  )
}
