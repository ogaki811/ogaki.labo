// Performance optimization utilities

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/noto-sans-jp.woff2'
  ]

  fonts.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = font
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })

  // Preload critical images
  const criticalImages = [
    '/uploads/profile-photo.jpg',
    '/og-image.jpg'
  ]

  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = src
    link.as = 'image'
    document.head.appendChild(link)
  })
}

/**
 * Optimize images with responsive loading
 */
export function getOptimizedImageSrc(
  src: string, 
  width: number,
  quality: number = 85,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  // Return original if not an optimized image
  if (!src.includes('/uploads/')) return src

  const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const sizeMap = {
    400: '_sm',
    800: '_md', 
    1200: '_lg',
    1600: '_xl'
  }

  // Find the appropriate size
  let sizeKey = Object.keys(sizeMap).find(key => parseInt(key) >= width)
  if (!sizeKey) sizeKey = '1600' // Default to largest

  const sizeSuffix = sizeMap[parseInt(sizeKey) as keyof typeof sizeMap]
  const extension = format === 'webp' ? '.webp' : src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg'

  return `${basePath}${sizeSuffix}${extension}`
}

/**
 * Generate responsive image srcSet
 */
export function generateSrcSet(src: string, format: 'webp' | 'original' = 'webp'): string {
  if (!src.includes('/uploads/')) return src

  const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const originalExt = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg'
  const ext = format === 'webp' ? '.webp' : originalExt

  return [
    `${basePath}_sm${ext} 400w`,
    `${basePath}_md${ext} 800w`,
    `${basePath}_lg${ext} 1200w`,
    `${basePath}_xl${ext} 1600w`
  ].join(', ')
}

/**
 * Calculate Cumulative Layout Shift (CLS) impact
 */
export function calculateCLS(element: Element, callback: (impact: number) => void) {
  if (!window.PerformanceObserver) return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        callback((entry as any).value)
      }
    }
  })

  observer.observe({ entryTypes: ['layout-shift'] })

  return () => observer.disconnect()
}

/**
 * Resource hints for critical assets
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
  ]

  hints.forEach(hint => {
    if (!document.querySelector(`link[href="${hint.href}"]`)) {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    }
  })
}

/**
 * Optimize third-party scripts
 */
export function loadScriptAsync(src: string, onLoad?: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    
    script.onload = () => {
      onLoad?.()
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`))
    }

    document.head.appendChild(script)
  })
}

/**
 * Service Worker registration for caching
 */
export function registerServiceWorker() {
  if (
    typeof window !== 'undefined' && 
    'serviceWorker' in navigator && 
    process.env.NODE_ENV === 'production'
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

/**
 * Bundle analyzer helper for development
 */
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Measure bundle parse time
    const startTime = performance.now()
    
    window.addEventListener('load', () => {
      const endTime = performance.now()
      console.log(`Bundle parse time: ${endTime - startTime}ms`)
      
      // Log bundle information
      if (performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource')
        const jsResources = resources.filter(r => r.name.endsWith('.js'))
        const totalJSSize = jsResources.reduce((total, resource) => 
          total + ((resource as PerformanceResourceTiming).transferSize || 0), 0)
        
        console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)} KB`)
      }
    })
  }
}