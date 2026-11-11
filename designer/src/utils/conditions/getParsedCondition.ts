import type { DesignCondition, PreviewValue } from '@root/types/preview'

import { CONDITION_OPERATORS } from './conditionModel'

export const getParsedCondition = (value: unknown): DesignCondition => {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid condition')
  }

  const record = value as Record<string, unknown>
  const source = record.source as Record<string, unknown> | undefined

  if (!source || !CONDITION_OPERATORS.includes(record.operator as DesignCondition['operator'])) {
    throw new Error('Invalid condition source or operator')
  }

  if (
    source.kind === 'field'
      ? typeof source.nodeId !== 'string'
      : source.kind !== 'example' ||
        typeof source.label !== 'string' ||
        !source.label.trim() ||
        !['success', 'failure'].includes(String(source.defaultValue))
  ) {
    throw new Error('Invalid condition source')
  }

  if (!['empty', 'notEmpty'].includes(String(record.operator))) {
    if (
      record.value === undefined ||
      !(
        record.value === null ||
        ['string', 'boolean'].includes(typeof record.value) ||
        (typeof record.value === 'number' && Number.isFinite(record.value))
      )
    ) {
      throw new Error('Invalid comparison value')
    }

    if (
      !['equals', 'notEquals'].includes(String(record.operator)) &&
      (typeof record.value !== 'number' || !Number.isFinite(record.value))
    ) {
      throw new Error('Numeric condition requires a finite number')
    }
  }

  if (
    record.operator === 'between' &&
    (typeof record.upperValue !== 'number' ||
      !Number.isFinite(record.upperValue) ||
      record.upperValue < Number(record.value))
  ) {
    throw new Error('Invalid condition range')
  }

  if (
    source.kind === 'example' &&
    (record.operator !== 'equals' || !['success', 'failure'].includes(String(record.value)))
  ) {
    throw new Error('Invalid example result condition')
  }

  return {
    source:
      source.kind === 'field'
        ? { kind: 'field', nodeId: source.nodeId as string }
        : {
            kind: 'example',
            label: source.label as string,
            defaultValue: source.defaultValue as 'success' | 'failure',
          },
    operator: record.operator as DesignCondition['operator'],
    ...(record.value !== undefined ? { value: record.value as PreviewValue } : {}),
    ...(record.operator === 'between' ? { upperValue: record.upperValue as number } : {}),
  }
}
