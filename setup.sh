#!/bin/bash

echo "=================================="
echo "  経絡ボンバー - セットアップ"
echo "=================================="
echo ""

# 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ インストールに失敗しました"
    exit 1
fi

echo "✅ インストール完了！"
echo ""

# ローカルビルドテスト
echo "🔨 ビルドをテスト中..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ ビルドに失敗しました"
    exit 1
fi

echo "✅ ビルド成功！"
echo ""

# Git初期化チェック
if [ ! -d .git ]; then
    echo "🔧 Gitリポジトリを初期化中..."
    git init
    git add .
    git commit -m "Initial commit: Keiraku Bomber game"
    echo "✅ Git初期化完了"
else
    echo "ℹ️  Gitリポジトリは既に初期化されています"
fi

echo ""
echo "=================================="
echo "  セットアップ完了！ 🎉"
echo "=================================="
echo ""
echo "次のステップ:"
echo ""
echo "1️⃣  ローカルで起動:"
echo "    npm run dev"
echo ""
echo "2️⃣  GitHubにプッシュ:"
echo "    git remote add origin https://github.com/YOUR_USERNAME/keiraku-bomber.git"
echo "    git push -u origin main"
echo ""
echo "3️⃣  Vercelでデプロイ:"
echo "    https://vercel.com にアクセスしてリポジトリをインポート"
echo ""
echo "詳細は DEPLOYMENT.md を参照してください"
echo ""
