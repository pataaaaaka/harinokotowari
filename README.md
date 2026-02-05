# 経絡ボンバー（Keiraku Bomber）

東洋医学をテーマにしたボンバーマン風アクションゲーム

## 🎮 ゲームについて

経絡（気の流れ）を開通させるために、鍼（はり）とお灸（きゅう）を使って敵を倒し、ステージをクリアしていくゲームです。

### 特徴
- 5つの臓器ステージ（心臓、肺、肝臓、腎臓、脾臓）
- 各ステージに守護霊が登場
- レスポンシブデザイン対応
- PWA対応（オフラインプレイ可能）
- モバイル・タブレット・デスクトップ対応

## 🚀 デプロイ手順

### 1. GitHubへのアップロード

```bash
# リポジトリを初期化
git init
git add .
git commit -m "Initial commit: Keiraku Bomber game"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/YOUR_USERNAME/keiraku-bomber.git
git branch -M main
git push -u origin main
```

### 2. Vercelでのデプロイ

#### 方法A: Vercel CLIを使用
```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 方法B: Vercel Webサイトから
1. https://vercel.com にアクセス
2. "Import Project" をクリック
3. GitHubリポジトリを選択
4. フレームワークプリセット: **Vite**
5. ビルドコマンド: `npm run build`
6. 出力ディレクトリ: `dist`
7. "Deploy" をクリック

## 📱 PWA機能

このアプリはPWA（Progressive Web App）として動作します：

- **オフライン対応**: 一度読み込めばオフラインでプレイ可能
- **ホーム画面追加**: スマホのホーム画面にアプリとして追加可能
- **フルスクリーン**: ブラウザのUIなしで実行
- **自動更新**: 新バージョンが自動的に適用

### インストール方法
1. ブラウザでアクセス
2. 「ホーム画面に追加」または「インストール」を選択
3. アイコンからアプリを起動

## 💻 ローカル開発

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 🎮 操作方法

### PC
- **移動**: 矢印キー（↑↓←→）
- **お灸**: スペースキー
- **鍼（方向指定）**: Z（↑）、X（↓）、C（←）、V（→）
- **鍼（全方向）**: Aキー

### モバイル
- 画面下部の仮想コントローラーを使用

## 🛠 技術スタック

- **フレームワーク**: React 18
- **ビルドツール**: Vite 5
- **PWA**: vite-plugin-pwa
- **デプロイ**: Vercel
- **スタイリング**: Vanilla CSS

## 📦 プロジェクト構成

```
keiraku-bomber/
├── public/              # 静的ファイル（アイコン等）
├── src/
│   ├── App.jsx         # メインアプリケーション
│   ├── App.css         # アプリスタイル
│   ├── KeirakuBomberFull.jsx  # ゲームコンポーネント
│   ├── main.jsx        # エントリーポイント
│   └── index.css       # グローバルスタイル
├── index.html          # HTMLテンプレート
├── vite.config.js      # Vite設定（PWA含む）
├── vercel.json         # Vercel設定
└── package.json        # 依存関係
```

## 🌐 ブラウザ対応

- Chrome / Edge (推奨)
- Safari (iOS 12.2+)
- Firefox
- Samsung Internet

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

バグ報告や機能提案は Issues でお願いします。

## 📞 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。
