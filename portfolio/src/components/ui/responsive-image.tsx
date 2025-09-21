'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  quality?: number
  sizes?: string
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: ResponsiveImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Generate srcSet for different sizes
  const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const extension = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg'
  
  const generateSrcSet = (format: 'webp' | 'original') => {
    const ext = format === 'webp' ? '.webp' : extension
    return [
      `${basePath}_sm${ext} 400w`,
      `${basePath}_md${ext} 800w`, 
      `${basePath}_lg${ext} 1200w`,
      `${basePath}_xl${ext} 1600w`
    ].join(', ')
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">画像を読み込めませんでした</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      
      <picture>
        {/* WebP format for modern browsers */}
        <source 
          srcSet={generateSrcSet('webp')}
          sizes={sizes}
          type="image/webp"
        />
        
        {/* Fallback to original format */}
        <source 
          srcSet={generateSrcSet('original')}
          sizes={sizes}
          type={`image/${extension.replace('.', '')}`}
        />
        
        <Image
          src={hasError ? '/uploads/placeholder.jpg' : src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          quality={quality}
          sizes={sizes}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </picture>
    </div>
  )
}