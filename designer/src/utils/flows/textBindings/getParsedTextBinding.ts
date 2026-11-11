import type { DesignNode } from '@root/types/document'

export const getParsedTextBinding = (value: unknown): NonNullable<DesignNode['textBinding']> => {
  if (
    !value ||
    typeof value !== 'object' ||
    !('sourceNodeId' in value) ||
    typeof value.sourceNodeId !== 'string' ||
    !value.sourceNodeId
  ) {
    throw new Error('Invalid text field binding')
  }

  if ('designText' in value && typeof value.designText !== 'string') {
    throw new Error('Text binding designText must be a string')
  }

  return {
    sourceNodeId: value.sourceNodeId,
    ...('designText' in value ? { designText: value.designText as string } : {}),
  }
}
