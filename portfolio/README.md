# ogaki.labo - ポートフォリオサイト

![Portfolio Banner](./docs/images/banner.png)

小川祐樹の転職活動用ポートフォリオサイトです。デザインからエンジニアリング、そしてマネジメントへと発展してきたキャリアを紹介し、技術スキルとプロジェクト実績を包括的に展示しています。

## ✨ 特徴

- 🎯 **転職活動特化**: 採用担当者が求める情報を効果的に伝達
- 📱 **完全レスポンシブ**: モバイル・タブレット・デスクトップ完全対応
- ⚡ **高パフォーマンス**: Next.js 15 + 静的生成による高速表示
- 🌐 **日本語対応**: 完全な日本語UI・コンテンツ
- 🔍 **SEO最適化**: JSON-LD構造化データ・メタタグ完備
- 🛡️ **セキュリティ**: セキュリティヘッダー・HTTPS対応
- 🎨 **モダンUI**: Tailwind CSS 4による美しいデザイン
- 📊 **管理画面**: コンテンツ管理システム内蔵
- ♿ **アクセシビリティ**: WCAG準拠・スクリーンリーダー対応
- 🖼️ **画像最適化**: Sharp・遅延読み込み実装済み

## 🚀 技術スタック

### フロントエンド
- **Next.js 15** - React フレームワーク（App Router）
- **TypeScript** - 型安全な開発
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Zod** - スキーマ検証
- **Sharp** - 画像最適化
- **React Context** - 状態管理

### インフラ・デプロイ
- **AWS S3** - 静的ウェブサイトホスティング
- **CloudFront** - CDN・SSL/TLS
- **GitHub Actions** - CI/CD自動化
- **Route 53** - DNS管理（オプション）

### 開発ツール
- **ESLint + Prettier** - コード品質・フォーマット
- **VS Code** - 推奨エディタ
- **Git** - バージョン管理

## 📋 要件

- Node.js 18.x 以上
- npm 9.x 以上
- Git

## 🛠️ セットアップ

### 1. プロジェクトのクローン

```bash
git clone https://github.com/ogaki811/ogaki.labo.git
cd ogaki.labo/portfolio
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサイトを確認できます。

### 4. 管理画面へのアクセス

```bash
# 管理画面URL
http://localhost:3000/admin/login

# デモ認証情報
Email: admin@ogaki.labo
Password: portfolio123
```

## 📁 プロジェクト構造

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 管理画面
│   │   ├── projects/          # プロジェクトページ
│   │   ├── skills/            # スキルページ
│   │   ├── career/            # キャリアページ
│   │   ├── contact/           # お問い合わせページ
│   │   └── ...
│   ├── lib/                   # ユーティリティ・ヘルパー
│   │   ├── data.ts           # データ取得関数
│   │   ├── utils.ts          # 汎用ユーティリティ
│   │   ├── validation.ts     # Zodスキーマ
│   │   ├── constants.ts      # 定数・設定
│   │   └── seo.ts            # SEO・メタデータ
│   └── types/                 # TypeScript型定義
├── data/                      # JSONデータファイル
│   ├── profile.json          # プロフィール情報
│   ├── projects.json         # プロジェクト実績
│   ├── skills.json           # スキル・技術
│   ├── career.json           # キャリア履歴
│   └── tags.json             # タグ情報
├── public/                    # 静的ファイル
│   └── uploads/              # アップロード画像
├── docs/                      # ドキュメント
├── .github/workflows/         # GitHub Actions
└── ...
```

## 🎯 主要機能

### 🏠 ホームページ
- プロフィール紹介・統計表示
- 注目プロジェクトのハイライト
- ソーシャルメディアリンク

### 📊 概要ページ (`/overview`)
- ポートフォリオ統計・サマリー
- プロジェクト・スキル分布
- 主要技術スタックの可視化

### 💼 プロジェクトページ (`/projects`)
- プロジェクト一覧・詳細表示
- カテゴリ・タグフィルター
- 検索機能・関連プロジェクト

### 🛠️ スキルページ (`/skills`)
- カテゴリ別スキル表示
- レベル・経験年数の可視化
- フィルター・統計情報

### 👔 キャリアページ (`/career`)
- タイムライン形式の職歴
- 実績・成果の詳細
- キャリア統計・成長軌跡

### 📧 お問い合わせページ (`/contact`)
- バリデーション付きフォーム（mailto対応）
- スパム対策・セキュリティ機能
- ハニーポット実装済み

### 🔧 管理画面 (`/admin`)
- ダッシュボード・統計表示
- プロジェクト・スキル管理
- プロフィール・画像管理
- JWT風トークン認証（クライアントサイド）

## 🚦 使用方法

### 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド（本番用）
npm run build

# 静的エクスポート（S3用）
npm run build && npm run export

# リンティング
npm run lint

# リンティング自動修正
npm run lint:fix

# 型チェック
npm run type-check

# 画像最適化
npm run optimize-images
```

### コンテンツ更新

#### 1. JSONファイル直接編集

```bash
# プロジェクト追加
vim data/projects.json

# スキル更新
vim data/skills.json

# プロフィール変更
vim data/profile.json
```

#### 2. 管理画面使用

1. `http://localhost:3000/admin/login` にアクセス
2. 認証情報でログイン
3. GUI でコンテンツを編集

## 🌐 デプロイメント

### 自動デプロイ（推奨）

1. **GitHub Secrets の設定**

GitHub リポジトリの Settings > Secrets で以下を設定：

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
```

2. **mainブランチにプッシュ**

```bash
git push origin main
```

GitHub Actions が自動的にビルド・デプロイを実行します。

### 手動デプロイ

詳細は [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) を参照してください。

## 🔧 カスタマイズ

### デザインカスタマイズ

```bash
# Tailwind設定
vim tailwind.config.ts

# グローバルスタイル
vim src/app/globals.css
```

### データスキーマ変更

```bash
# 型定義
vim src/types/portfolio.ts

# バリデーション
vim src/lib/validation.ts
```

### 機能追加

```bash
# 新しいページ
mkdir src/app/new-page
vim src/app/new-page/page.tsx

# ユーティリティ関数
vim src/lib/utils.ts
```

## 📚 ドキュメント

- [AWS セットアップガイド](./docs/AWS_SETUP.md)
- [デプロイメント・保守ガイド](./docs/DEPLOYMENT.md)

## 🧪 テスト

```bash
# 型チェック
npm run type-check

# リンティング
npm run lint

# ビルドテスト
npm run build
```

## 🐛 トラブルシューティング

### よくある問題

**ビルドエラー:**
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

**画像が表示されない:**
- `public/uploads/` ディレクトリの権限確認
- 画像ファイルのパス確認

**管理画面にアクセスできない:**
- 認証情報の確認
- ブラウザのローカルストレージをクリア

**静的エクスポートエラー:**
- APIルートは静的サイトでサポートされません
- searchParamsを使用するページは動的になります
- `dynamic = "force-static"`の設定を確認

## 🔐 セキュリティ

- HTTPS/SSL 必須
- セキュリティヘッダー設定済み
- スパム対策実装済み
- 依存関係の脆弱性定期チェック

## 📈 パフォーマンス

- Lighthouse スコア 90+ 目標
- 画像最適化・遅延読み込み
- CDN・キャッシュ最適化
- バンドルサイズ最小化

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👤 作成者

**小川祐樹**
- Website: [ogaki.labo](https://ogaki.labo)
- Email: contact@ogaki.labo
- GitHub: [@ogaki811](https://github.com/ogaki811)
- LinkedIn: [小川祐樹](https://linkedin.com/in/ogaki)

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - 素晴らしいReactフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Claude Code](https://claude.ai/code) - AI支援開発ツール
- [Vercel](https://vercel.com/) - 開発体験の向上

---

⭐ このプロジェクトが役に立ったらスターをつけてください！
