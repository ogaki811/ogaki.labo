'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="ja-JP">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <svg 
                className="w-24 h-24 text-red-500 mx-auto"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              システムエラー
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              申し訳ございません。システムに重大なエラーが発生しました。
              <br />
              ページを再読み込みしてください。
            </p>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ページを再読み込み
              </button>
              
              <div>
                <a
                  href="/"
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  ホームに戻る
                </a>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">開発モード - エラー詳細:</h3>
                <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap">
                  {error.message}
                  {error.stack && (
                    <>
                      <br />
                      {error.stack}
                    </>
                  )}
                  {error.digest && (
                    <>
                      <br />
                      Digest: {error.digest}
                    </>
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}