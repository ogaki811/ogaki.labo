import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import Link from "next/link"
import { DEFAULT_METADATA, generateOrganizationStructuredData, generateJSONLD } from "@/lib/seo"
import { NAVIGATION_ITEMS, SOCIAL_LINKS, SITE_CONFIG } from "@/lib/constants"
import { SkipToContent } from "@/components/ui/accessible-button"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
})

export const metadata: Metadata = DEFAULT_METADATA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationData = generateOrganizationStructuredData()

  return (
    <html lang="ja-JP" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateJSONLD(organizationData)
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <SkipToContent />
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {SITE_CONFIG.name}
                    </span>
                  </Link>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                  {NAVIGATION_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile menu button */}
                <button 
                  className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                  aria-label="メニュー"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Site info */}
                <div className="col-span-1 md:col-span-2">
                  <Link href="/" className="inline-block mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      {SITE_CONFIG.name}
                    </span>
                  </Link>
                  <p className="text-gray-600 mb-4 max-w-md">
                    {SITE_CONFIG.description}
                  </p>
                  <div className="flex space-x-4">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={social.name}
                      >
                        <span className="sr-only">{social.name}</span>
                        {/* アイコンは後でアイコンライブラリで実装 */}
                        <div className="w-5 h-5 bg-gray-400 rounded"></div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">ナビゲーション</h3>
                  <ul className="space-y-2">
                    {NAVIGATION_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">お問い合わせ</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href={`mailto:${SITE_CONFIG.author.email}`}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {SITE_CONFIG.author.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://github.com/${SITE_CONFIG.author.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t mt-8 pt-8 text-center">
                <p className="text-gray-500 text-sm">
                  © {new Date().getFullYear()} {SITE_CONFIG.author.name}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
