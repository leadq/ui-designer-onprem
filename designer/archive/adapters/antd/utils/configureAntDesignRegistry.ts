import { getCardJSX, renderFieldJSX, renderToggleJSX } from '@root/adapters/antd/exportConfig';
import { AntDesignModalSurface, AntDesignToastSurface } from '@root/adapters/antd/OverlaySurface';
import { getOverlayMeta } from '@root/adapters/shared/overlayMeta';
import {
  getEventChecked,
  getEventValue,
  getPreviewValueConfig,
  getScalarValue,
} from '@root/adapters/shared/previewValues';
import type { Registry } from '@root/types/componentContract';

export const configureAntDesignRegistry = (antDesignRegistry: Registry): void => {
  antDesignRegistry.box.showEmptyPlaceholder = true;

  antDesignRegistry.box.getDefaultLayoutStyle = (props) => ({
    display: 'flex',
    flexDirection: props.vertical === false ? 'row' : 'column',
  });

  antDesignRegistry.card.showEmptyPlaceholder = false;
  antDesignRegistry.card.exportConfig.renderJSX = getCardJSX;
  antDesignRegistry.typography.exportConfig.jsxName = 'Typography.Text';
  antDesignRegistry.grid.exportConfig.additionalImports = ['Col'];
  antDesignRegistry.grid.exportConfig.wrapChild = (jsx) => `<Col span={12}>${jsx}</Col>`;

  for (const [type, name] of Object.entries({
    textInput: 'Input',
    numberInput: 'InputNumber',
    textarea: 'Input.TextArea',
    select: 'Select',
    switch: 'Switch',
  })) {
    const meta = antDesignRegistry[type];

    meta.exportConfig = {
      ...meta.exportConfig,
      additionalImports: ['Form'],
      renderJSX: renderFieldJSX(name),
    };
  }

  for (const type of ['checkbox', 'radio']) {
    const meta = antDesignRegistry[type];

    meta.exportConfig = {
      ...meta.exportConfig,
      renderJSX: renderToggleJSX(meta.exportConfig.importName),
    };
  }

  antDesignRegistry.list.exportConfig.agentPlaceholder =
    'Implement data mapping and item template with the target Ant Design List.';

  antDesignRegistry.dataTable.exportConfig.agentPlaceholder =
    'Map semantic columns/data to Ant Design columns/dataSource and preserve configured cell callbacks.';

  for (const type of [
    'textInput',
    'textarea',
    'select',
    'numberInput',
    'checkbox',
    'switch',
    'radio',
  ]) {
    const meta = antDesignRegistry[type];
    const checked = ['checkbox', 'switch', 'radio'].includes(type);

    meta.previewValue = getPreviewValueConfig(
      type === 'switch'
        ? getScalarValue
        : checked
          ? getEventChecked
          : ['select', 'numberInput'].includes(type)
            ? getScalarValue
            : getEventValue,
      checked,
    );

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

  antDesignRegistry.modal = getOverlayMeta(antDesignRegistry.box, 'modal', AntDesignModalSurface, {
    importPath: 'antd',
    importName: 'Modal',
    importType: 'named',
    additionalImports: ['Flex'],
    renderJSX: (node, props, children) =>
      `<Modal open={${Boolean(node.overlay?.initiallyOpen)}} mask={${node.overlay?.withBackdrop !== false}} footer={null} title={${JSON.stringify(node.label ?? 'Modal')}}><Flex vertical ${props.join(' ')}>${children}</Flex></Modal>`,
  });

  antDesignRegistry.notification = getOverlayMeta(
    antDesignRegistry.box,
    'notification',
    AntDesignToastSurface,
    {
      importPath: 'antd',
      importName: 'Alert',
      importType: 'named',
      renderJSX: (node, props, children) =>
        `<Alert type="info" message={${JSON.stringify(node.label ?? 'Toast')}} ${props.join(' ')} description={<>${children}</>} />`,
    },
  );
};
