"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ComponentProps } from 'react'

const fallbackImage = "https://http.cat/404"

interface ImageWithFallbackProps extends Omit<ComponentProps<typeof Image>, 'src'> {
    fallback?: string
    alt: string
    src: string
}

export const ImageWithFallback = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
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