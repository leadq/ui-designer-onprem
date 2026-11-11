import { useEffect, useState } from 'react'

import styles from './styles.module.scss'

export interface ReferenceImageViewProps {
  blob: Blob
  alt: string
  isActualSize?: boolean
}

export const ReferenceImageView = ({
  blob,
  alt,
  isActualSize = false,
}: ReferenceImageViewProps) => {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const next = URL.createObjectURL(blob)

    setUrl(next)

    return () => URL.revokeObjectURL(next)
  }, [blob])

  return (
    <div
      className={`${styles.referenceImageView} ${isActualSize ? styles['referenceImageView--actual'] : ''}`}
    >
      {url ? <img alt={alt} draggable={false} src={url} /> : null}
    </div>
  )
}
