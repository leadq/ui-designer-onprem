import { useState } from 'react'
import { openPreviewTab } from '@root/components/Editor/OpenPreviewButton/utils/openPreviewTab'
import { useEditorStore } from '@root/stores/editor'
import { getPreviewSnapshot } from '@root/utils/preview/previewSession/getPreviewSnapshot'

export const usePreviewTab = () => {
  const [isBlocked, setIsBlocked] = useState(false)

  const handleOpenClick = () => {
    try {
      openPreviewTab(getPreviewSnapshot(useEditorStore.getState(), Date.now()))

      setIsBlocked(false)
    } catch {
      setIsBlocked(true)
    }
  }

  const handleDismissClose = () => setIsBlocked(false)

  return { isBlocked, handleOpenClick, handleDismissClose }
}
