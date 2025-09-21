'use client'

import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  }

  return (
    <div
      className={clsx(
        'border-gray-200 border-t-blue-600 rounded-full animate-spin',
        sizes[size],
        className
      )}
      role="status"
      aria-label="読み込み中"
    />
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  avatar?: boolean
}

export function LoadingSkeleton({ className, lines = 3, avatar = false }: LoadingSkeletonProps) {
  return (
    <div className={clsx('animate-pulse', className)}>
      {avatar && (
        <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={clsx(
              'h-4 bg-gray-200 rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={clsx('animate-pulse', className)}>
      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

interface LoadingPageProps {
  title?: string
  description?: string
}

export function LoadingPage({ 
  title = '読み込み中...', 
  description = 'しばらくお待ちください' 
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className,
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </button>
  )
}

// Table loading skeleton
export function LoadingTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="border-t border-gray-200 px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <div
                  key={colIndex}
                  className={clsx(
                    'h-4 bg-gray-200 rounded',
                    colIndex === 0 ? 'w-3/4' : 'w-full'
                  )}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// List loading skeleton
export function LoadingList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}