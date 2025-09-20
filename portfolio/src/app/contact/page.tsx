import { generateMetadata } from "@/lib/seo"
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants"
import ContactForm from "./contact-form"

export const metadata = generateMetadata({
  title: "お問い合わせ",
  description: "プロジェクトのご相談、お仕事のご依頼、その他ご質問等がございましたら、お気軽にお問い合わせください。",
  path: "/contact"
})

export default function ContactPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            お問い合わせ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            プロジェクトのご相談、お仕事のご依頼、その他ご質問等がございましたら、
            お気軽にお問い合わせください。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                連絡先情報
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">メール</h3>
                    <a 
                      href={`mailto:${SITE_CONFIG.author.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {SITE_CONFIG.author.email}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      24時間以内にご返信いたします
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">返信時間</h3>
                    <p className="text-gray-700">平日: 24時間以内</p>
                    <p className="text-gray-700">休日: 48時間以内</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">対応状況</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">転職活動中</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      新しいポジションやプロジェクトをお探しです
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ソーシャルメディア
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gray-400 rounded mr-3 group-hover:bg-gray-500 transition-colors"></div>
                    <div>
                      <div className="font-medium text-gray-900">{social.name}</div>
                      <div className="text-sm text-gray-600">プロフィールを見る</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* What I can help with */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ご相談可能な内容
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">フロントエンド開発プロジェクト</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">チーム・エンジニアリング・マネジメント</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">UI/UXデザインとプロトタイピング</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">アジャイル開発プロセス導入</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">技術コンサルティング</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">転職・キャリア相談</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                メッセージを送る
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            よくある質問
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                プロジェクトの相談は無料ですか？
              </h3>
              <p className="text-gray-700 text-sm">
                初回のご相談は無料です。プロジェクトの概要をお聞きし、
                どのようにお手伝いできるかをご提案いたします。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                リモートワークは可能ですか？
              </h3>
              <p className="text-gray-700 text-sm">
                はい、リモートワークでの対応が可能です。
                必要に応じてオンサイトでの対応も相談可能です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                小規模なプロジェクトでも対応していますか？
              </h3>
              <p className="text-gray-700 text-sm">
                プロジェクトの規模に関わらず、お気軽にご相談ください。
                内容に応じて最適な提案をいたします。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                転職活動中とのことですが、業務委託は可能ですか？
              </h3>
              <p className="text-gray-700 text-sm">
                転職活動と並行して、短期的な業務委託やコンサルティングも
                お受けしております。詳しくはご相談ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}