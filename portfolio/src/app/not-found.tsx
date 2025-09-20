import Link from "next/link"
import { NAVIGATION_ITEMS } from "@/lib/constants"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ページが見つかりません
          </h1>
          <p className="text-gray-600 mb-6">
            お探しのページは存在しないか、移動した可能性があります。
            URLをもう一度ご確認いただくか、以下のリンクからお探しください。
          </p>
        </div>

        {/* Navigation Links */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            おすすめページ
          </h2>
          <div className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              お探しの情報がありませんか？
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              プロジェクトやスキル情報を検索してみてください
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              プロジェクトを検索
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            ホームに戻る
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500">
            問題が解決しない場合は、
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              お問い合わせ
            </Link>
            ページからご連絡ください。
          </p>
        </div>
      </div>
    </div>
  )
}