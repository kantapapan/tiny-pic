# tiny-pic システム要件・設計・仕様書（クリーンアーキテクチャ版）

---

## 📝 概要

**tiny-pic** は、  
ChatGPT 4oで生成された**大容量PNG画像**を、**自前圧縮**し、**S3にアップロード**する  
**Node.js（v22.15.2）＋TypeScript**の**CLIアプリケーション**です。

TinyPNG APIは使用せず、**ローカルで圧縮処理**を完結させます。

本アプリケーションは**クリーンアーキテクチャ／DDD（ドメイン駆動設計）**に基づいて設計します。

---

## 🛠 システム要件

### 使用技術

- Node.js v22.15.2（ESMモジュール）
- TypeScript v5.8.3
- 圧縮ライブラリ：`sharp v0.34.1`
- S3アップロードライブラリ：`@aws-sdk/client-s3 v3.797.0`
- CLI構築ライブラリ：`commander v13.1.0`
- 環境変数管理：`dotenv v16.5.0`
- ファイル操作：`fs/promises`（標準モジュール）

### 対象ファイル

- 拡張子：`.png`
- 入力ディレクトリ内のすべてのPNGファイルを対象とする

---

## 📦 使用パッケージ

| 目的 | パッケージ | バージョン |
|:---|:---|:---|
| PNG画像圧縮 | `sharp` | v0.34.1 |
| S3アップロード | `@aws-sdk/client-s3` | v3.797.0 |
| CLIコマンド解析 | `commander` | v13.1.0 |
| 環境変数管理 | `dotenv` | v16.5.0 |
| TypeScript | `typescript` | v5.8.3 |
| テスト | `jest` | v29.7.0 |

---

## 📂 ディレクトリ構成（クリーンアーキテクチャ）

```
tiny-pic/
├── src/
│   ├── application/           # アプリケーション層（ユースケース）
│   ├── domain/                # ドメイン層（ビジネスルール）
│   ├── infrastructure/        # インフラストラクチャ層（実装）
│   ├── interfaces/            # インターフェース層（入出力）
│   └── index.ts              # エントリーポイント
├── compressed-images/         # 圧縮後出力ディレクトリ
├── .env                       # 環境変数定義ファイル
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 .envファイル例

```env
AWS_ACCESS_KEY_ID=xxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
AWS_REGION=ap-northeast-1
AWS_BUCKET_NAME=my-blog-images
AWS_UPLOAD_PREFIX=images/blog/
```

---

## 🧩 各レイヤー詳細

| レイヤー | 内容 |
|:---|:---|
| domain/ | `Image`モデル、画像圧縮サービスインターフェース、リポジトリインターフェース定義 |
| application/ | 圧縮・アップロードなどユースケース定義（アプリケーションサービス） |
| infrastructure/ | `sharp`による圧縮、`@aws-sdk/client-s3`によるアップロードなど外部依存実装 |
| interfaces/ | CLIエントリーポイント、サブコマンド、ロギングなど |

---

## 📋 CLIコマンド仕様

### 圧縮コマンド

```bash
npx tiny-pic compress --input ./generated-images
```

- 入力ディレクトリ内のPNGファイルを圧縮
- 出力先は `compressed-images/` ディレクトリ
- デフォルト圧縮設定（変更可能）

### アップロードコマンド

```bash
npx tiny-pic upload --input ./compressed-images
```

- 指定ディレクトリ内のファイルをS3にアップロード
- アップロード先パスは `.env`の`AWS_UPLOAD_PREFIX`に従う

---

## 📉 圧縮ポリシー

- PNG形式を維持したまま圧縮
- 使用ライブラリ：`sharp`
- デフォルト設定：
  - `compressionLevel: 9`
  - `adaptiveFiltering: true`
  - メタデータ除去
- （将来的に）品質やリサイズオプション拡張可能

---

## 🚀 将来の発展候補（今回は対象外）

- WebPやAVIFへのフォーマット変換
- アップロード後のCDNキャッシュパージ
- バッチアップロードの並列化高速化
- 圧縮率・アップロード結果のログファイル保存

---

# ✅ 注意事項

- TinyPNG APIは使用しない。
- すべてローカルで処理完結させる。
- Node.js v22.15.2に完全対応する。
- CLIツールとして単独動作可能にする（グローバルインストール不要）。

---
