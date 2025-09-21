'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Hook for managing focus states and keyboard navigation
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<Element | null>(null)

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      setFocusedElement(event.target as Element)
    }

    const handleBlur = () => {
      setFocusedElement(null)
    }

    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { focusedElement, trapFocus }
}

/**
 * Hook for managing reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const announceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.style.position = 'absolute'
    announcer.style.left = '-10000px'
    announcer.style.width = '1px'
    announcer.style.height = '1px'
    announcer.style.overflow = 'hidden'
    
    document.body.appendChild(announcer)
    announceRef.current = announcer

    return () => {
      if (announceRef.current && document.body.contains(announceRef.current)) {
        document.body.removeChild(announceRef.current)
      }
    }
  }, [])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message
    }
  }, [])

  return { announce }
}

/**
 * Hook for high contrast mode detection
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    let lastInput = ''

    const handleKeyDown = () => {
      if (lastInput !== 'keyboard') {
        lastInput = 'keyboard'
        setIsKeyboardUser(true)
        document.body.classList.add('keyboard-user')
      }
    }

    const handleMouseDown = () => {
      if (lastInput !== 'mouse') {
        lastInput = 'mouse'
        setIsKeyboardUser(false)
        document.body.classList.remove('keyboard-user')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isKeyboardUser
}