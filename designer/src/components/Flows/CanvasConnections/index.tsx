import { ConnectionLines } from '@root/components/Flows/CanvasConnections/ConnectionLines'
import { useCanvasConnections } from '@root/hooks/canvas/useCanvasConnections'

export const CanvasConnections = () => {
  const { paths } = useCanvasConnections()

  return <ConnectionLines paths={paths} />
}
