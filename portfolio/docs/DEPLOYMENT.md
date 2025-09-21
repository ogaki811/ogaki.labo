# デプロイメント・保守ガイド

このドキュメントでは、ポートフォリオサイトのデプロイメント手順と日常的な保守作業について説明します。

## 目次

1. [開発環境のセットアップ](#1-開発環境のセットアップ)
2. [ローカル開発](#2-ローカル開発)
3. [デプロイメント](#3-デプロイメント)
4. [コンテンツ管理](#4-コンテンツ管理)
5. [保守・監視](#5-保守監視)
6. [トラブルシューティング](#6-トラブルシューティング)

## 1. 開発環境のセットアップ

### 1.1 必要な要件

- Node.js 18.x 以上
- npm 9.x 以上
- Git
- VS Code（推奨）

### 1.2 プロジェクトのクローン

```bash
# リポジトリをクローン
git clone https://github.com/ogaki811/ogaki.labo.git
cd ogaki.labo/portfolio

# 依存関係をインストール
npm install
```

### 1.3 VS Code 設定

推奨拡張機能：
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

## 2. ローカル開発

### 2.1 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
```

### 2.2 ビルドとテスト

```bash
# プロダクションビルド
npm run build

# 静的エクスポート（S3用）
npm run export

# リンティング
npm run lint

# リンティング自動修正
npm run lint:fix

# 型チェック
npm run type-check
```

### 2.3 開発ワークフロー

1. **ブランチの作成**
```bash
git checkout -b feature/new-project
```

2. **開発作業**
```bash
# ファイルを編集
# 自動的にホットリロードされる
```

3. **コミット前チェック**
```bash
npm run lint
npm run build
```

4. **コミット**
```bash
git add .
git commit -m "feat: 新しいプロジェクト追加

- ECサイトリニューアルプロジェクトを追加
- 技術スタックにNext.js 14を追加
- 画像最適化を実装

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 3. デプロイメント

### 3.1 自動デプロイ（推奨）

メインブランチへのプッシュで自動デプロイが実行されます：

```bash
# mainブランチにマージ
git checkout main
git merge feature/new-project
git push origin main

# GitHub Actionsが自動実行される
```

### 3.2 手動デプロイ

```bash
# 1. ビルド
npm run build

# 2. AWS CLIでS3にアップロード
aws s3 sync out/ s3://your-portfolio-bucket \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html"

# 3. HTMLファイルは別途キャッシュ設定
aws s3 sync out/ s3://your-portfolio-bucket \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --content-type "text/html"

# 4. CloudFrontキャッシュの無効化
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 3.3 デプロイの確認

```bash
# サイトアクセス確認
curl -I https://your-domain.com

# レスポンス時間測定
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

## 4. コンテンツ管理

### 4.1 プロジェクトの追加

1. **データファイルの編集**
```bash
# プロジェクトデータを追加
vim data/projects.json
```

2. **画像の追加**
```bash
# 画像をアップロード（管理画面使用推奨）
cp new-project-image.jpg public/uploads/
```

3. **検証**
```bash
# 型チェック
npm run type-check

# ローカルで確認
npm run dev
```

### 4.2 スキルの更新

```bash
# スキルデータを編集
vim data/skills.json

# 管理画面からも編集可能
# http://localhost:3000/admin にアクセス
```

### 4.3 プロフィール情報の更新

```bash
# プロフィールデータを編集
vim data/profile.json

# キャリア情報の更新
vim data/career.json
```

## 5. 保守・監視

### 5.1 定期的なメンテナンス

**月次作業:**
- 依存関係の更新確認
- セキュリティアップデートの適用
- パフォーマンス指標の確認
- コンテンツの更新

```bash
# 依存関係の更新確認
npm outdated

# セキュリティ監査
npm audit

# セキュリティ問題の修正
npm audit fix
```

**四半期作業:**
- AWS コストの確認と最適化
- CloudWatch メトリクスの分析
- バックアップの検証
- ドキュメントの更新

### 5.2 監視設定

**CloudWatch アラート:**
```bash
# エラー率監視
aws cloudwatch put-metric-alarm \
  --alarm-name "PortfolioErrorRate" \
  --alarm-description "Portfolio error rate" \
  --metric-name 4xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold
```

**ログ監視:**
```bash
# CloudFrontログの確認
aws logs filter-log-events \
  --log-group-name /aws/cloudfront/distribution \
  --start-time $(date -d '1 hour ago' +%s)000
```

### 5.3 バックアップ

**自動バックアップ設定:**
```bash
# S3バケットのバージョニング有効化
aws s3api put-bucket-versioning \
  --bucket your-portfolio-bucket \
  --versioning-configuration Status=Enabled

# ライフサイクルポリシーの設定
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-portfolio-bucket \
  --lifecycle-configuration file://lifecycle.json
```

**手動バックアップ:**
```bash
# データファイルのバックアップ
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/

# S3に保存
aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

## 6. トラブルシューティング

### 6.1 よくある問題

**ビルドエラー:**
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュクリア
rm -rf .next/
npm run build
```

**デプロイエラー:**
```bash
# AWS認証情報の確認
aws sts get-caller-identity

# S3バケット権限の確認
aws s3api get-bucket-policy --bucket your-portfolio-bucket
```

**パフォーマンス問題:**
```bash
# Lighthouse監査
npx lighthouse https://your-domain.com --output json --output-path lighthouse-report.json

# バンドルサイズ分析
npm run analyze
```

### 6.2 ログの確認

**アプリケーションログ:**
```bash
# 開発時のログ
npm run dev 2>&1 | tee dev.log

# ビルド時のログ
npm run build 2>&1 | tee build.log
```

**AWS ログ:**
```bash
# CloudFrontアクセスログ
aws s3 ls s3://your-cloudfront-logs/

# S3アクセスログ
aws s3 ls s3://your-s3-access-logs/
```

### 6.3 緊急時対応

**サイトダウン時:**
1. CloudWatch でエラー状況を確認
2. 直前のデプロイを確認
3. 必要に応じてロールバック実行

```bash
# 緊急ロールバック
git revert HEAD
git push origin main
```

**セキュリティインシデント:**
1. CloudFrontディストリビューションを一時無効化
2. 問題の調査と修正
3. セキュリティパッチの適用

```bash
# ディストリビューション無効化
aws cloudfront update-distribution \
  --id YOUR_DISTRIBUTION_ID \
  --distribution-config file://disabled-config.json
```

## 7. パフォーマンス最適化

### 7.1 画像最適化

```bash
# 画像圧縮ツールの使用
npm install -g imagemin-cli

# 一括圧縮
imagemin public/uploads/*.jpg --out-dir=public/uploads/optimized --plugin=imagemin-mozjpeg
```

### 7.2 バンドル最適化

```bash
# バンドル分析
npm run build
npm run analyze

# 不要な依存関係の削除
npm uninstall unused-package
```

### 7.3 CDN最適化

- キャッシュ戦略の見直し
- 圧縮設定の最適化
- HTTP/2サポートの確認

## 8. セキュリティ

### 8.1 定期セキュリティチェック

```bash
# 脆弱性スキャン
npm audit

# 依存関係のセキュリティチェック
npx snyk test
```

### 8.2 セキュリティヘッダー

CloudFront Functions でセキュリティヘッダーを設定：

```javascript
function handler(event) {
    var response = event.response;
    var headers = response.headers;

    headers['strict-transport-security'] = { 
        value: 'max-age=63072000; includeSubdomains; preload'
    };
    headers['x-content-type-options'] = { value: 'nosniff' };
    headers['x-frame-options'] = { value: 'DENY' };
    headers['x-xss-protection'] = { value: '1; mode=block' };
    
    return response;
}
```

## 9. チェックリスト

### デプロイ前チェックリスト

- [ ] ローカルでビルドが成功する
- [ ] リンティングエラーがない
- [ ] 型チェックが通る
- [ ] 重要ページが正常に表示される
- [ ] レスポンシブデザインが機能している
- [ ] SEO メタデータが適切に設定されている

### デプロイ後チェックリスト

- [ ] サイトが正常にアクセスできる
- [ ] 全ページが正常に表示される
- [ ] 画像が正しく読み込まれる
- [ ] フォームが正常に動作する
- [ ] モバイル表示が正常
- [ ] ページ読み込み速度が良好

## 10. 連絡先・サポート

**技術的な問題:**
- GitHubリポジトリでIssueを作成
- コードレビューが必要な場合はPull Requestを作成

**緊急時連絡:**
- AWSサポート（必要に応じて）
- ドメインレジストラサポート（ドメイン関連問題）

**定期的なレビュー:**
- 月次：パフォーマンス・セキュリティレビュー
- 四半期：コスト最適化レビュー
- 年次：技術スタックアップデートレビュー