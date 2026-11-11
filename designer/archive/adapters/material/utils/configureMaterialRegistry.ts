import { getSelectJSX, renderToggleJSX } from '@root/adapters/material/exportConfig';
import { MaterialModalSurface, MaterialToastSurface } from '@root/adapters/material/OverlaySurface';
import { getOverlayMeta } from '@root/adapters/shared/overlayMeta';
import {
  getEventChecked,
  getEventValue,
  getPreviewValueConfig,
} from '@root/adapters/shared/previewValues';
import { TABLE_CELL_SLOT } from '@root/adapters/shared/tableCellSchema';
import type { Registry } from '@root/types/componentContract';

export const configureMaterialRegistry = (materialRegistry: Registry): void => {
  materialRegistry.dataTable.exportConfig.agentPlaceholder =
    'Rebuild the semantic table columns and rows with Material UI TableHead/TableBody/TableCell.';

  materialRegistry.dataTable.propsSchema.push(TABLE_CELL_SLOT);

  materialRegistry.select.exportConfig = {
    ...materialRegistry.select.exportConfig,
    additionalImports: ['MenuItem'],
    renderJSX: getSelectJSX,
  };

  materialRegistry.grid.defaultProps.container = true;
  materialRegistry.grid.exportConfig.wrapChild = (jsx) => `<Grid size={6}>${jsx}</Grid>`;
  materialRegistry.numberInput.defaultProps.type = 'number';
  materialRegistry.textarea.defaultProps.multiline = true;

  for (const type of ['checkbox', 'switch', 'radio']) {
    const meta = materialRegistry[type];

    meta.exportConfig = {
      ...meta.exportConfig,
      additionalImports: ['FormControlLabel'],
      renderJSX: renderToggleJSX(meta.exportConfig.importName),
    };
  }

  for (const type of [
    'textInput',
    'textarea',
    'select',
    'numberInput',
    'checkbox',
    'switch',
    'radio',
  ]) {
    const meta = materialRegistry[type];
    const checked = ['checkbox', 'switch', 'radio'].includes(type);

    meta.previewValue = getPreviewValueConfig(checked ? getEventChecked : getEventValue, checked);

    if (!checked && !meta.propsSchema.some((prop) => prop.key === 'defaultValue')) {
      meta.propsSchema = [
        ...meta.propsSchema,
        {
          key: 'defaultValue',
          label: 'Initial value',
          type: type === 'numberInput' ? 'number' : 'text',
          defaultValue: '',
        },
      ];
    }
  }

  materialRegistry.modal = getOverlayMeta(materialRegistry.box, 'modal', MaterialModalSurface, {
    importPath: '@mui/material',
    importName: 'Dialog',
    importType: 'named',
    additionalImports: ['DialogTitle', 'DialogContent'],
    renderJSX: (node, props, children) =>
      `<Dialog open={${Boolean(node.overlay?.initiallyOpen)}} hideBackdrop={${node.overlay?.withBackdrop === false}}><DialogTitle>{${JSON.stringify(node.label ?? 'Modal')}}</DialogTitle><DialogContent ${props.join(' ')}>${children}</DialogContent></Dialog>`,
  });

  materialRegistry.notification = getOverlayMeta(
    materialRegistry.box,
    'notification',
    MaterialToastSurface,
    {
      importPath: '@mui/material',
      importName: 'Alert',
      importType: 'named',
      additionalImports: ['AlertTitle'],
      renderJSX: (node, props, children) =>
        `<Alert severity="info" ${props.join(' ')}><AlertTitle>{${JSON.stringify(node.label ?? 'Toast')}}</AlertTitle>${children}</Alert>`,
    },
  );
};
