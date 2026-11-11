import { z } from 'zod';

const node = z.object({ id: z.string().min(1), type: z.string().min(1), children: z.array(z.unknown()) }).passthrough();
const document = z.object({ version: z.number().int().positive(), adapterId: z.string().min(1), nodes: z.array(node), pageName: z.string() }).passthrough();
const target = { designId: z.string().uuid(), editorId: z.string().min(1), version: z.number().int().positive() };
const reference = z.object({ id: z.string().min(1), name: z.string(), width: z.number().positive(), height: z.number().positive() }).passthrough();
const receipt = z.object({
  id: z.string().uuid(), designId: z.string().uuid(), status: z.literal('applied'),
  frameIds: z.array(z.string()), version: z.number().int().positive(), isPersisted: z.boolean(),
}).passthrough();
const schemas: Record<string, z.ZodType<unknown>> = {
  export_selected_frames: z.object({ ...target, scope: z.object({kind:z.literal('selected-frames'),frameIds:z.array(z.string()).min(1),overlayIds:z.array(z.string()),omitted:z.object({}).passthrough()}), document:z.union([document,z.object({format:z.literal('ui-design/flat'),rootIds:z.array(z.string()),nodesById:z.record(z.string(),z.unknown())}).passthrough()]) }),
  get_design: z.object({ ...target, document }).passthrough(),
  get_editor_context: z.object({
    ...target, ready: z.literal(true), documentHash: z.string().regex(/^[a-f0-9]{64}$/),
    adapterId: z.string(), selectedNodeIds: z.array(z.string()), selectedNodes: z.array(z.object({}).passthrough()),
    canvasWidth: z.number().positive(), activeBreakpoint: z.string(), previewMode: z.boolean(),
    references: z.array(reference), selectedReferences: z.array(reference),
  }).passthrough(),
  get_component: node.extend({ adapterId: z.string() }),
  list_components: z.array(z.object({ id: z.string(), type: z.string(), name: z.string(), adapterId: z.string() }).passthrough()),
  get_behaviors: z.array(z.object({ id: z.string(), nodeId: z.string().nullable(), kind: z.enum(['page', 'component']), text: z.string(), targetName: z.string() }).passthrough()),
  list_reference_images: z.object({ images: z.array(reference), designVersion: z.number().int().positive() }).passthrough(),
  list_designs: z.array(z.object({ designId: z.string().uuid(), version: z.number().int().positive(), updatedAt: z.number(), active: z.boolean() }).passthrough()),
  update_design: receipt,
  import_design: receipt,
  get_design_import: z.union([receipt, z.object({ status: z.literal('unknown'), message: z.string() })]),
  get_reference_image: z.object({ data: z.string().min(1).regex(/^[A-Za-z0-9+/]*={0,2}$/), metadata: reference }),
};

// Validate the RPC result envelope; canonical mutation validation stays in the browser engine.
export const validateBrowserResult = (operation: string, result: unknown, args: Record<string, unknown>) => {
  const parsed = schemas[operation]?.safeParse(result);
  if (!parsed?.success) throw new Error('INVALID_BROWSER_RESPONSE');
  const record = result as Record<string, unknown>;
  if (['get_design', 'get_editor_context', 'export_selected_frames'].includes(operation) &&
      ((args.designId !== undefined && record.designId !== args.designId) ||
       (args.editorId !== undefined && record.editorId !== args.editorId)))
    throw new Error('INVALID_BROWSER_RESPONSE');
  if (operation === 'export_selected_frames' && (record.version !== args.expectedVersion || JSON.stringify([...((record.scope as {frameIds:string[]}).frameIds)].sort()) !== JSON.stringify([...(args.frameIds as string[])].sort()))) throw new Error('INVALID_BROWSER_RESPONSE');
  if (operation === 'get_component' && record.id !== args.id)
    throw new Error('INVALID_BROWSER_RESPONSE');
  if (operation === 'get_reference_image' && (record.metadata as { id: string }).id !== args.referenceId)
    throw new Error('INVALID_BROWSER_RESPONSE');
  if (['update_design', 'import_design'].includes(operation) &&
      (record.id !== args.requestId || record.designId !== args.designId))
    throw new Error('INVALID_BROWSER_RESPONSE');
  if (operation === 'get_design_import' && record.status !== 'unknown' && record.id !== args.requestId)
    throw new Error('INVALID_BROWSER_RESPONSE');
  return result;
};
