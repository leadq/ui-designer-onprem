import { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

// The editor is client rendered; IDs are unique across roots and stable per mount.
export const useStableId = () => {
  const id = useRef('')

  if (!id.current) {
    id.current = `designer-${uuidv4()}`
  }

  return id.current
}
