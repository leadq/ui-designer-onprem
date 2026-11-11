import type { DesignNode } from '@root/types/document'

export const getParsedToggleBinding = (
  value: unknown,
): NonNullable<DesignNode['toggleBinding']> => {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid toggle binding')
  }

  const binding = value as Record<string, unknown>

  if (
    binding.visibleNodeIds !== undefined &&
    (!Array.isArray(binding.visibleNodeIds) ||
      !binding.visibleNodeIds.every((id) => typeof id === 'string') ||
      new Set(binding.visibleNodeIds).size !== binding.visibleNodeIds.length)
  ) {
    throw new Error('Invalid visibility targets')
  }

  if (binding.visibleNodeId !== undefined && typeof binding.visibleNodeId !== 'string') {
    throw new Error('Invalid visibility target')
  }

  if (
    !Array.isArray(binding.exclusiveWith) ||
    !binding.exclusiveWith.every((id) => typeof id === 'string') ||
    new Set(binding.exclusiveWith).size !== binding.exclusiveWith.length
  ) {
    throw new Error('Invalid exclusive fields')
  }

  if (
    binding.hiddenWhenCheckedNodeIds !== undefined &&
    (!Array.isArray(binding.hiddenWhenCheckedNodeIds) ||
      !binding.hiddenWhenCheckedNodeIds.every((id) => typeof id === 'string') ||
      new Set(binding.hiddenWhenCheckedNodeIds).size !== binding.hiddenWhenCheckedNodeIds.length)
  ) {
    throw new Error('Invalid inverse visibility targets')
  }

  return {
    ...(binding.hiddenWhenCheckedNodeIds
      ? { hiddenWhenCheckedNodeIds: binding.hiddenWhenCheckedNodeIds as string[] }
      : {}),
    ...(binding.visibleNodeIds ? { visibleNodeIds: binding.visibleNodeIds as string[] } : {}),
    ...(binding.visibleNodeId ? { visibleNodeId: binding.visibleNodeId as string } : {}),
    exclusiveWith: binding.exclusiveWith as string[],
  }
}
