import { useStableId } from '@root/hooks/useStableId'
import type { ConnectionLinesModel } from '@root/types/connectionLines'

export type { ConnectionPath } from '@root/types/connectionLines'

export type ConnectionLinesProps = ConnectionLinesModel

import styles from './styles.module.scss'

/** SVG is an editor primitive: no pointer interception and no exported document nodes. */
export const ConnectionLines = ({ paths }: ConnectionLinesProps) => {
  const id = useStableId().replaceAll(':', '')

  return (
    <svg aria-label='Flow connections' className={styles.connectionLines}>
      <defs>
        <marker
          id={`${id}-arrow`}
          markerHeight='8'
          markerUnits='userSpaceOnUse'
          markerWidth='8'
          orient='auto-start-reverse'
          refX='9'
          refY='5'
          viewBox='0 0 10 10'
        >
          <path
            d='M 1 1 L 9 5 L 1 9'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.7'
          />
        </marker>
      </defs>
      <g>
        {paths.map((connection) => (
          <path
            key={connection.id}
            className={styles.connectionLines__path}
            d={connection.path}
            data-active={connection.isActive}
            data-anchor-id={connection.anchorId}
            data-conditional={connection.isConditional}
            data-flow-connection={connection.id}
            data-route-side={connection.routeSide}
            data-source-id={connection.sourceId}
            data-target-id={connection.targetId}
            data-via-ids={connection.viaIds.join(' ')}
            markerEnd={`url(#${id}-arrow)`}
          >
            <title>{connection.label}</title>
          </path>
        ))}
      </g>
    </svg>
  )
}
