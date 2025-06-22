# Calendar Project 📅

このプロジェクトは、Next.js, React, TypeScriptを使用して構築されたモダンなカレンダーアプリケーションです。

## 特徴

Calendar Projectは、シンプルで使いやすいカレンダーインターフェースを提供するWebアプリケーションです。最新のReactの機能とTypeScriptの型安全性を活用し、堅牢で保守性の高いアプリケーションを実現しています。

主な機能：
- モダンなUI/UXデザイン
- TypeScriptによる型安全性
- CSS Modulesによるコンポーネント単位のスタイリング

## 技術スタック

- Next.js (v14.2.15)
- React
- TypeScript
- CSS Modules

## セットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/so-engineer/calendar-project.git
```

2. 依存関係のインストール
```bash
npm install
```

3. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。


## プロジェクト構造

```
.
├── components/                     # Reactコンポーネントディレクトリ
│   ├── CalenderModal.tsx           # 予定の作成・編集用モーダルコンポーネント
│   ├── calendermodal.module.css    # CalenderModalのスタイル
│   ├── Layout.tsx                  # 全ページ共通のレイアウトコンポーネント
│   ├── layout.module.css           # Layoutのスタイル
│   └── context/                    # React Contextディレクトリ
│       └── PlanContext.tsx         # 予定データをグローバルに管理するContext
├── pages/                          # Next.jsのページディレクトリ (ファイルシステムベースルーティング)
│   ├── _app.tsx                    # 全ページで共通の処理を記述するファイル
│   ├── _document.tsx               # HTMLの<head>や<body>をカスタマイズするファイル
│   ├── index.tsx                   # トップページ (ルートURL)
│   ├── api/                        # APIエンドポイント
│   │   └── hello.ts                # サンプルAPI
│   ├── monthly/                    # 月表示カレンダー
│   │   └── [year]/
│   │       └── [month].tsx         # [年]/[月]の動的ルーティング
│   └── weekly/                     # 週表示カレンダー
│       └── [year]/
│           └── [month]/
│               └── [week].tsx      # [年]/[月]/[週]の動的ルーティング
├── public/                         # 静的ファイル配信ディレクトリ
│   └── favicon.ico                 # ファビコン
├── styles/                         # グローバルスタイルディレクトリ
│   ├── globals.css                 # アプリケーション全体のスタイル
│   ├── Home.module.css             # ホームページ用のスタイル
│   └── utils.module.css            # ユーティリティスタイル
├── next.config.mjs                 # Next.jsの設定ファイル
├── tsconfig.json                   # TypeScriptの設定ファイル
└── package.json                    # プロジェクトの依存関係とスクリプト
```

## 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルドしたアプリケーションの起動
npm run start

# リントの実行
npm run lint
```

## その他
セキュリティには十分注意してください。
