'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  placeholder?: ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
}

export function LazyLoad({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = ''
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce && hasTriggered) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (placeholder || <div className="h-64 bg-gray-100 animate-pulse rounded" />)}
    </div>
  )
}

// 特定用途向けの遅延読み込みコンポーネント
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  ...props
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  [key: string]: any
}) {
  return (
    <LazyLoad
      placeholder={
        <div 
          className={`bg-gray-200 animate-pulse rounded ${className}`}
          style={{ width, height }}
        />
      }
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        {...props}
      />
    </LazyLoad>
  )
}

export function LazySection({
  children,
  className = '',
  placeholder
}: {
  children: ReactNode
  className?: string
  placeholder?: ReactNode
}) {
  return (
    <LazyLoad
      className={className}
      placeholder={placeholder || (
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded" />
          <div className="h-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
        </div>
      )}
    >
      {children}
    </LazyLoad>
  )
}