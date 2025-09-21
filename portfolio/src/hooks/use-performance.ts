'use client'

import { useEffect, useCallback, useRef, useState, useMemo } from 'react'

// Web Vitals tracking
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Report Web Vitals to analytics
    const reportWebVitals = (metric: any) => {
      console.log(metric)
      // In a real app, you would send this to your analytics service
      // Example: analytics.track('Web Vital', metric)
    }

    // Dynamically import web-vitals to avoid increasing bundle size
    // Note: web-vitals package not installed, using mock implementation
    try {
      // This would be the real implementation:
      // import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      //   onCLS(reportWebVitals)
      //   onFID(reportWebVitals)
      //   onFCP(reportWebVitals)
      //   onLCP(reportWebVitals)
      //   onTTFB(reportWebVitals)
      // })
      console.log('Web Vitals monitoring would be active in production')
    } catch (error) {
      console.warn('Web Vitals not available:', error)
    }
  }, [])
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
) {
  const observe = useCallback((element: Element | null) => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [callback, options])

  return observe
}

// Debounce hook for performance-critical operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling(
  itemHeight: number,
  containerHeight: number,
  itemCount: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  )

  const visibleItems = useMemo(() => {
    const items = []
    for (let i = startIndex; i < endIndex; i++) {
      items.push(i)
    }
    return items
  }, [startIndex, endIndex])

  const totalHeight = itemCount * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }
}