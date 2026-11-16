import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { getAdapter } from '@root/adapters'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { getAdapterBackgroundColor } from '@root/utils/colorTokens/getAdapterBackgroundColor'
import { getFrameIds, getWorkspaceNodes } from '@root/utils/frames/frameWorkspace'
import { getBreakpointForWidth } from '@root/utils/layout/getBreakpointForWidth'
import { type PreviewSnapshot, resetPreview } from '@root/utils/preview/previewSession'

import { DesignNodeWrapper } from '../Canvas/DesignNodeWrapper'
import { Box, Button, Text } from '../common'
import { PreviewScenarios } from '../Flows/PreviewScenarios'

import styles from './styles.module.scss'

export interface PrototypePreviewProps {
  snapshot: PreviewSnapshot | null
  isCaptureMode?: boolean
}

export const PrototypePreview = ({ snapshot, isCaptureMode = false }: PrototypePreviewProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const hiddenIds = useEditorStore((state) => state.prototypeHiddenNodeIds)
  const frameIds = getFrameIds(nodes)

  const visibleScreens = nodes
    .filter((node) => frameIds.has(node.id) && !node.overlay && !hiddenIds.includes(node.id))
    .map((node) => node.id)
    .join('|')

  const adapterId = useEditorStore((state) => state.adapterId)
  const [version, setVersion] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const previousScreens = useRef<string | null>(null)
  const adapter = getAdapter(adapterId)
  const AdapterProvider = adapter.Provider

  useEffect(() => {
    const viewport = viewportRef.current

    if (!snapshot || !viewport) {
      return
    }

    const update = () =>
      useEditorStore.setState({
        canvasWidth: viewport.clientWidth,
        activeBreakpoint: getBreakpointForWidth(viewport.clientWidth),
      })

    update()

    let pendingFrame: number | null = null

    const scheduleUpdate = () => {
      if (pendingFrame !== null) {
        return
      }

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null

        update()
      })
    }

    const observer = new ResizeObserver(scheduleUpdate)

    observer.observe(viewport)

    return () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame)
      }

      observer.disconnect()
    }
  }, [snapshot])

  useEffect(() => {
    if (previousScreens.current !== visibleScreens) {
      previousScreens.current = visibleScreens

      viewportRef.current?.scrollTo(0, 0)
    }
  }, [visibleScreens])

  const handleRestart = () => {
    if (!snapshot) {
      return
    }

    resetPreview(snapshot)

    setVersion((value) => value + 1)

    viewportRef.current?.scrollTo(0, 0)
  }

  const handleRestartClick = handleRestart

  return (
    <Box
      data-render-capture={isCaptureMode && snapshot ? 'ready' : undefined}
      className={[
        styles.prototypePreview,
        isCaptureMode ? styles['prototypePreview--capture'] : '',
      ].join(' ')}
    >
      {!isCaptureMode && (
        <Box data-designer-chrome className={styles.prototypePreview__toolbar}>
          <Text weight={600}>{snapshot?.document.pageName ?? translate('preview.open')}</Text>
          <Text className={styles.prototypePreview__hint} color='muted' size='xs'>
            {translate('preview.snapshotHint')}
          </Text>
          {snapshot ? (
            <Button size='sm' variant='outline' onClick={handleRestartClick}>
              {translate('preview.restart')}
            </Button>
          ) : null}
          <Button size='sm' variant='ghost' onClick={() => window.close()}>
            {translate('general.close')}
          </Button>
        </Box>
      )}
      {snapshot ? (
        <>
          {!isCaptureMode && <PreviewScenarios />}
          <Box
            ref={viewportRef}
            className={styles.prototypePreview__viewport}
            id='preview-scroll-container'
            style={
              { '--designer-frame-background': getAdapterBackgroundColor(adapter) } as CSSProperties
            }
          >
            <Box
              data-designer-library
              className={styles.prototypePreview__content}
              id='render-layer'
            >
              <AdapterProvider key={`${adapterId}-${version}`}>
                {getWorkspaceNodes(nodes).map((node) => (
                  <DesignNodeWrapper key={node.id} node={node} />
                ))}
              </AdapterProvider>
            </Box>
          </Box>
        </>
      ) : (
        <Box data-designer-chrome className={styles.prototypePreview__error}>
          <Text>{translate('preview.missing')}</Text>
        </Box>
      )}
    </Box>
  )
}
