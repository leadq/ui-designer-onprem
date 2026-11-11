import type { DesignCondition, PreviewValue } from '@root/types/preview'

import { getNumber } from './getNumber'

/** null = unavailable/invalid input; neither branch may run. No eval or source-code expressions. */
export const isConditionMatched = (
  condition: DesignCondition,
  value: PreviewValue | undefined,
): boolean | null => {
  if (value === undefined) {
    return null
  }

  const empty = value === null || (typeof value === 'string' && !value.trim())

  if (condition.operator === 'empty') {
    return empty
  }

  if (condition.operator === 'notEmpty') {
    return !empty
  }

  if (condition.operator === 'equals' || condition.operator === 'notEquals') {
    const actual = typeof condition.value === 'number' ? getNumber(value) : value

    if (typeof condition.value === 'number' && actual === null) {
      return null
    }

    return condition.operator === 'equals' ? actual === condition.value : actual !== condition.value
  }

  const number = getNumber(value)
  const expected = getNumber(condition.value)

  if (number === null || expected === null) {
    return null
  }

  if (condition.operator === 'greater') {
    return number > expected
  }

  if (condition.operator === 'less') {
    return number < expected
  }

  if (condition.operator === 'atLeast') {
    return number >= expected
  }

  if (condition.operator === 'atMost') {
    return number <= expected
  }

  return (
    number >= expected && typeof condition.upperValue === 'number' && number <= condition.upperValue
  )
}
