import type { PreviewValue, PreviewValueConfig } from '@root/types/preview';

export const getScalarValue = (value: unknown): PreviewValue | undefined =>
  value === null ||
  ['string', 'boolean'].includes(typeof value) ||
  (typeof value === 'number' && Number.isFinite(value))
    ? (value as PreviewValue)
    : undefined;

export const getEventValue = (event: unknown): PreviewValue | undefined => {
  const target = event && typeof event === 'object' && 'target' in event ? event.target : null;

  return target && typeof target === 'object' && 'value' in target
    ? getScalarValue(target.value)
    : undefined;
};

export const getEventChecked = (event: unknown): PreviewValue | undefined => {
  const target = event && typeof event === 'object' && 'target' in event ? event.target : null;

  return target && typeof target === 'object' && 'checked' in target
    ? getScalarValue(target.checked)
    : undefined;
};

export const getPreviewValueConfig = (
  read: PreviewValueConfig['read'],
  checked = false,
): PreviewValueConfig => ({
  prop: checked ? 'checked' : 'value',
  defaultProp: checked ? 'defaultChecked' : 'defaultValue',
  eventProp: 'onChange',
  emptyValue: checked ? false : '',
  read,
});
