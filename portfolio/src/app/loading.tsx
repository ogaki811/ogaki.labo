export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-r-blue-300 rounded-full animate-spin mx-auto" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-gray-600 animate-pulse">
          読み込み中...
        </p>
      </div>
    </div>
  )
}