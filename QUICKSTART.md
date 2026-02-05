# 🚀 クイックスタート - 5分でデプロイ

## 最速デプロイ手順

### 1️⃣ ファイルをダウンロード (済み✅)

このフォルダ全体があなたのプロジェクトです。

### 2️⃣ 依存関係をインストール

```bash
npm install
```

### 3️⃣ ローカルで動作確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 4️⃣ GitHubにアップロード

```bash
# Gitリポジトリ初期化
git init
git add .
git commit -m "Initial commit: Keiraku Bomber"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/あなたのユーザー名/keiraku-bomber.git
git branch -M main
git push -u origin main
```

### 5️⃣ Vercelでデプロイ

1. https://vercel.com にアクセス
2. 「Continue with GitHub」でログイン
3. 「Add New Project」をクリック
4. GitHubリポジトリを選択
5. **Framework Preset**: Vite を確認
6. 「Deploy」をクリック

**完了！** 🎉

---

## 📱 PWA機能

デプロイ後、スマホで以下を試してください：

1. サイトにアクセス
2. 「ホーム画面に追加」または「インストール」
3. アイコンをタップしてアプリとして起動！

---

## 🆘 問題が起きたら

### ビルドエラー
```bash
npm clean-install
npm run build
```

### デプロイエラー
- Vercelダッシュボードのログを確認
- `package.json`と`vite.config.js`を確認

### PWAが動かない
- HTTPSでアクセスしているか確認（Vercelは自動）
- ブラウザキャッシュをクリア

---

## 📚 詳細ドキュメント

- **完全な手順**: `DEPLOYMENT.md`
- **チェックリスト**: `CHECKLIST.md`
- **一般情報**: `README.md`

---

## 🎮 操作方法

### PC
- **移動**: ↑↓←→
- **お灸**: スペース
- **鍼**: Z/X/C/V
- **全方向鍼**: A

### モバイル
- 画面下部のコントローラー

---

**それでは、良いゲームライフを！** 🧑‍⚕️🔥
