"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

const fallbackImage = "https://http.cat/404"

export const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}: {
  fallback?: string
  alt: string
  src: string
  [key: string]: any
}) => {
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    setError(false)
  }, [src])

  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallback : src}
      {...props}
    />
  )
} 