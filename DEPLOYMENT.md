# デプロイガイド - 経絡ボンバー

## 📋 デプロイ前のチェックリスト

### 必要なもの
- ✅ GitHubアカウント
- ✅ Vercelアカウント（GitHubでサインアップ可能）
- ✅ Node.js v18以上（ローカル開発用）

## 🚀 ステップ・バイ・ステップガイド

### ステップ1: GitHubリポジトリの作成

1. https://github.com にアクセス
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名: `keiraku-bomber`（任意）
4. Public または Private を選択
5. 「Create repository」をクリック

### ステップ2: ローカルからGitHubへアップロード

プロジェクトフォルダで以下のコマンドを実行：

```bash
# Git初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Keiraku Bomber game"

# GitHubリポジトリを追加（YOUR_USERNAMEを実際のユーザー名に）
git remote add origin https://github.com/YOUR_USERNAME/keiraku-bomber.git

# メインブランチに変更
git branch -M main

# プッシュ
git push -u origin main
```

### ステップ3: Vercelでデプロイ

#### 方法A: Vercel Webサイトから（推奨・簡単）

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」でログイン
3. ダッシュボードで「Add New...」→「Project」をクリック
4. 「Import Git Repository」セクションで作成したリポジトリを検索
5. 「Import」をクリック
6. 設定画面で以下を確認：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
7. 「Deploy」をクリック
8. 数分待つとデプロイ完了！

#### 方法B: Vercel CLI（コマンドライン）

```bash
# Vercel CLIをインストール
npm install -g vercel

# Vercelにログイン
vercel login

# デプロイ（初回はプロジェクト設定が表示される）
vercel

# 本番環境にデプロイ
vercel --prod
```

### ステップ4: デプロイ完了

デプロイが完了すると：
- 🌐 公開URL: `https://your-project.vercel.app`
- 🔄 自動デプロイ: Gitにプッシュすると自動更新
- 📱 PWA対応: すぐにインストール可能

## 🔧 カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」
3. 「Add Domain」で独自ドメインを追加
4. DNSレコードを設定（Vercelが指示を表示）

## 📱 PWAインストール確認

デプロイ後、以下を確認：

### Chromeの場合
1. サイトにアクセス
2. アドレスバー右側に「インストール」アイコンが表示される
3. クリックしてインストール

### iPhoneの場合
1. Safariでサイトにアクセス
2. 共有ボタン（↑）をタップ
3. 「ホーム画面に追加」を選択

### Androidの場合
1. Chromeでサイトにアクセス
2. メニュー→「アプリをインストール」または「ホーム画面に追加」

## 🐛 トラブルシューティング

### ビルドエラーが出る場合

```bash
# 依存関係を再インストール
npm clean-install

# ローカルでビルドテスト
npm run build
```

### PWAが動作しない場合

1. HTTPSでアクセスしているか確認（Vercelは自動対応）
2. ブラウザのキャッシュをクリア
3. manifest.jsonが正しく読み込まれているか確認

### モバイルで表示がおかしい場合

- ブラウザの開発者ツールでモバイルビューをテスト
- `viewport`メタタグが正しく設定されているか確認

## 🔄 更新方法

コードを修正したら：

```bash
git add .
git commit -m "更新内容の説明"
git push
```

Vercelが自動的に再デプロイします！

## 📊 アクセス解析（オプション）

Vercelには標準でアナリティクスが付属：
- ダッシュボード→「Analytics」で確認
- ページビュー、パフォーマンス等を確認可能

## 💡 ヒント

- **プレビューデプロイ**: ブランチを作成すると自動的にプレビュー環境が作成される
- **環境変数**: Vercelダッシュボードで設定可能
- **ログ**: デプロイログはVercelダッシュボードで確認可能

## 🎉 完了

おめでとうございます！経絡ボンバーが全世界に公開されました！

URLを友達にシェアしてプレイしてもらいましょう🎮
