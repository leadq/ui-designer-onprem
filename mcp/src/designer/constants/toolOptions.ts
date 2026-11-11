import { z } from 'zod';

export const MAX_STARTER_PATTERNS = 6;

export const MAX_REQUESTED_COMPONENT_TYPES = 30;

export const patternSchema = z.enum([
  'form',
  'wizard',
  'data-display',
  'filtering',
  'dashboard',
  'behavior',
  'reference-images',
]);

export const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
