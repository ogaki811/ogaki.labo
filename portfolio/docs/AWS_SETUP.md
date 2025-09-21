# AWS S3 + CloudFront セットアップガイド

このドキュメントでは、ポートフォリオサイトをAWS S3とCloudFrontでホスティングするための設定手順を説明します。

## 前提条件

- AWSアカウントを持っていること
- GitHubリポジトリが設定されていること
- 独自ドメイン（オプション）

## 1. S3バケットの作成

### 1.1 S3バケットを作成

```bash
# AWS CLIを使用してバケットを作成
aws s3 mb s3://your-portfolio-bucket-name --region ap-northeast-1
```

### 1.2 静的ウェブサイトホスティングを有効化

```bash
# 静的ウェブサイトホスティングを設定
aws s3 website s3://your-portfolio-bucket-name \
  --index-document index.html \
  --error-document 404.html
```

### 1.3 バケットポリシーを設定

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-portfolio-bucket-name/*"
    }
  ]
}
```

```bash
# バケットポリシーを適用
aws s3api put-bucket-policy \
  --bucket your-portfolio-bucket-name \
  --policy file://bucket-policy.json
```

## 2. CloudFront ディストリビューションの作成

### 2.1 CloudFrontディストリビューションを作成

```bash
# distribution-config.json ファイルを作成
cat > distribution-config.json << 'EOF'
{
  "CallerReference": "portfolio-distribution-$(date +%s)",
  "Comment": "Portfolio website distribution",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-portfolio-bucket-name",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-portfolio-bucket-name",
        "DomainName": "your-portfolio-bucket-name.s3-website-ap-northeast-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100",
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      }
    ]
  }
}
EOF

# ディストリビューションを作成
aws cloudfront create-distribution \
  --distribution-config file://distribution-config.json
```

### 2.2 独自ドメインの設定（オプション）

独自ドメインを使用する場合：

1. **SSL証明書の取得**
```bash
# ACM (AWS Certificate Manager) で証明書を発行
aws acm request-certificate \
  --domain-name your-domain.com \
  --domain-name www.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

2. **Route 53でドメイン設定**
```bash
# Route 53でホストゾーンを作成
aws route53 create-hosted-zone \
  --name your-domain.com \
  --caller-reference "portfolio-$(date +%s)"
```

## 3. IAMユーザーとポリシーの設定

### 3.1 デプロイ用IAMユーザーを作成

```bash
# IAMユーザーを作成
aws iam create-user --user-name portfolio-deploy
```

### 3.2 デプロイ用ポリシーを作成

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-portfolio-bucket-name",
        "arn:aws:s3:::your-portfolio-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3.3 ポリシーをユーザーにアタッチ

```bash
# ポリシーを作成
aws iam create-policy \
  --policy-name PortfolioDeployPolicy \
  --policy-document file://deploy-policy.json

# ユーザーにポリシーをアタッチ
aws iam attach-user-policy \
  --user-name portfolio-deploy \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/PortfolioDeployPolicy

# アクセスキーを作成
aws iam create-access-key --user-name portfolio-deploy
```

## 4. GitHub Secrets の設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定：

- `AWS_ACCESS_KEY_ID`: IAMユーザーのアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: IAMユーザーのシークレットアクセスキー
- `AWS_S3_BUCKET`: S3バケット名
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: CloudFrontディストリビューションID（オプション）
- `AWS_CLOUDFRONT_DOMAIN`: CloudFrontドメイン名（オプション）

## 5. デプロイの実行

### 5.1 手動デプロイ

```bash
# ビルドの実行
cd portfolio
npm run build

# S3にデプロイ
aws s3 sync out/ s3://your-portfolio-bucket-name \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html"

# HTMLファイルは別途キャッシュ設定
aws s3 sync out/ s3://your-portfolio-bucket-name \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --content-type "text/html"

# CloudFrontキャッシュの無効化
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 5.2 GitHub Actions による自動デプロイ

メインブランチにプッシュすると、GitHub Actionsが自動的にビルドとデプロイを実行します。

## 6. パフォーマンス最適化

### 6.1 キャッシュ戦略

- **HTMLファイル**: `Cache-Control: public, max-age=0, must-revalidate`
- **静的アセット**: `Cache-Control: public, max-age=31536000` (1年)
- **画像**: `Cache-Control: public, max-age=2592000` (30日)

### 6.2 圧縮設定

CloudFrontで以下のファイル形式の圧縮を有効化：
- text/html
- text/css
- application/javascript
- application/json
- text/xml

### 6.3 セキュリティヘッダー

CloudFront Functionsまたは Lambda@Edge でセキュリティヘッダーを追加：

```javascript
function handler(event) {
    var response = event.response;
    var headers = response.headers;

    headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload'};
    headers['content-type-options'] = { value: 'nosniff'};
    headers['x-frame-options'] = { value: 'DENY'};
    headers['x-xss-protection'] = { value: '1; mode=block'};
    headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin'};
    
    return response;
}
```

## 7. モニタリング

### 7.1 CloudWatch メトリクス

- S3バケットのリクエスト数
- CloudFrontのキャッシュヒット率
- レスポンス時間

### 7.2 アラート設定

```bash
# エラー率のアラートを作成
aws cloudwatch put-metric-alarm \
  --alarm-name "PortfolioHighErrorRate" \
  --alarm-description "High error rate for portfolio website" \
  --metric-name 4xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## 8. コスト最適化

### 8.1 S3 ストレージクラス

- 静的アセット: Standard
- ログファイル: Standard-IA または Glacier

### 8.2 CloudFront 価格クラス

- 全世界配信: PriceClass_All
- 北米・ヨーロッパのみ: PriceClass_100
- アジア太平洋含む: PriceClass_200

## 9. バックアップ戦略

### 9.1 S3 バージョニング

```bash
# バージョニングを有効化
aws s3api put-bucket-versioning \
  --bucket your-portfolio-bucket-name \
  --versioning-configuration Status=Enabled
```

### 9.2 クロスリージョンレプリケーション

```bash
# レプリケーション設定
aws s3api put-bucket-replication \
  --bucket your-portfolio-bucket-name \
  --replication-configuration file://replication-config.json
```

## 10. トラブルシューティング

### よくある問題

1. **404エラーが発生する**
   - S3バケットポリシーが正しく設定されているか確認
   - CloudFrontのカスタムエラーページ設定を確認

2. **キャッシュが更新されない**
   - CloudFrontの無効化を実行
   - キャッシュヘッダーの設定を確認

3. **デプロイが失敗する**
   - IAMポリシーの権限を確認
   - GitHub Secretsの設定を確認

### ログの確認

```bash
# CloudFrontアクセスログの確認
aws logs describe-log-groups --log-group-name-prefix /aws/cloudfront

# S3アクセスログの確認
aws s3 ls s3://your-log-bucket/access-logs/
```

## まとめ

このセットアップにより、高性能で費用効率的なポートフォリオサイトをAWSで運用できます。継続的なモニタリングと最適化を行い、最良のユーザー体験を提供しましょう。