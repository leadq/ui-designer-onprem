import { Box, Button, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { getNextFrameLabel } from '@root/utils/frames/frameWorkspace'

import { FlowCard } from '../FlowCard'

import styles from './styles.module.scss'

export const FlowPanel = () => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const addFlow = useEditorStore((state) => state.addFlow)
  const previewMode = useEditorStore((state) => state.previewMode)
  const flows = getAllNodes(nodes).filter((node) => node.flow)

  return (
    <Box className={styles.flowPanel}>
      <Stack gap='md'>
        <Text weight={600}>{translate('flow.screens')}</Text>
        <Text color='muted' size='xs'>
          {translate('flow.empty')}
        </Text>
        {!flows.length && (
          <Button
            isDisabled={previewMode}
            variant='outline'
            onClick={() =>
              addFlow(
                translate('flow.screenGroup'),
                getNextFrameLabel(nodes, translate('flow.newFrameName')),
              )
            }
          >
            {translate('flow.createScreens')}
          </Button>
        )}
        {flows.map((flow) => (
          <FlowCard key={flow.id} node={flow} />
        ))}
      </Stack>
    </Box>
  )
}
