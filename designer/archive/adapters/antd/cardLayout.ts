import type { CSSProperties } from 'react';

/** Ant Card owns a body wrapper; forward layout through it without removing its native padding. */
export const CARD_BODY_LAYOUT: CSSProperties = {
  display: 'inherit',
  flexDirection: 'inherit',
  flexWrap: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
  gap: 'inherit',
  gridTemplateColumns: 'inherit',
  gridTemplateRows: 'inherit',
  gridColumn: '1 / -1',
  flexGrow: 1,
  minWidth: 0,
};
