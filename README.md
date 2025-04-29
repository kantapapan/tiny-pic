# tiny-pic

[![Node.js Version](https://img.shields.io/badge/node-v22.15.2-blue.svg)](https://nodejs.org/)
[![TypeScript Version](https://img.shields.io/badge/typescript-v5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/kantapapan/tiny-pic/actions)

<div align="center">
  <p><em>高速・高品質な画像圧縮とS3アップロードを実現するCLIツール</em></p>
</div>

## 🚀 特徴

- ⚡️ **高速圧縮**: `sharp`ライブラリによる最適化された画像圧縮
- 🎯 **高品質**: 画質を維持しながら最大70%のサイズ削減
- 🔒 **セキュア**: AWS認証情報の安全な管理
- 📦 **使いやすい**: シンプルなCLIインターフェース
- 🧪 **テスト済み**: 包括的なユニットテストと統合テスト

## 🛠 技術スタック

- **ランタイム**: Node.js v22.15.2
- **言語**: TypeScript v5.8.3
- **主要ライブラリ**:
  - `sharp`: 画像処理
  - `@aws-sdk/client-s3`: AWS S3操作
  - `commander`: CLI構築
  - `dotenv`: 環境変数管理
- **テスト**: Jest
- **ビルドツール**: TypeScript Compiler

## 📋 必要条件

### 環境変数の設定（必須）

AWS S3 にアップロードするためには、以下の環境変数を `.env` ファイルに設定する必要があります：

```env
AWS_ACCESS_KEY_ID=<あなたのAWSアクセスキー>
AWS_SECRET_ACCESS_KEY=<あなたのAWSシークレットキー>
AWS_REGION=<S3のリージョン>
AWS_BUCKET_NAME=<S3のバケット名>
AWS_UPLOAD_PREFIX=<アップロード先のプレフィックス>（オプション、デフォルト: images/）
```

> ⚠️ 注意: 環境変数が設定されていない場合、S3アップロード機能は動作しません。

## 🚀 クイックスタート

### インストール

```bash
npm install
```

### 基本的な使い方

1. 画像の圧縮:
```bash
npx tiny-pic compress --input ./images --output ./compressed-images
```

2. S3へのアップロード:
```bash
npx tiny-pic upload --input ./compressed-images
```

## 📖 詳細な使用方法

### 画像の圧縮

以下のコマンドで指定したディレクトリ内の PNG 画像を圧縮できます：

```bash
npx tiny-pic compress --input <入力ディレクトリ> --output <出力ディレクトリ>
```

#### 圧縮仕様

- **対応フォーマット**: PNG画像のみ
- **圧縮方式**: `sharp`ライブラリを使用した非可逆圧縮
- **デフォルト設定**:
  - 圧縮レベル: 9（最高圧縮率）
  - 適応フィルタリング: 有効
  - メタデータ: 除去
  - カラープロファイル: 保持
  - 透過情報: 保持
- **圧縮効果**:
  - 通常のPNG画像で30-70%のサイズ削減
  - 画質の劣化を最小限に抑えながら圧縮
  - 透過PNGの透過情報を保持

#### 圧縮オプション

- `-i, --input <directory>`: 入力ディレクトリのパス（デフォルト: カレントディレクトリ）
- `-o, --output <directory>`: 出力ディレクトリのパス（デフォルト: ./compressed-images）
- `-l, --level <level>`: 圧縮レベル（1-9、デフォルト: 9）
  - 1: 最低圧縮率（最高画質）
  - 9: 最高圧縮率（最低画質）
- `-a, --adaptive-filtering <boolean>`: 適応フィルタリングの使用（true/false、デフォルト: true）
  - true: 画像の特性に応じて最適なフィルタを選択
  - false: 固定フィルタを使用
- `-v, --verbose`: 詳細なログを出力
  - 各画像の圧縮前後のサイズ
  - 圧縮率
  - 処理時間

### 圧縮画像の S3 アップロード

以下のコマンドで圧縮された画像を AWS S3 にアップロードできます：

```bash
npx tiny-pic upload --input <圧縮画像ディレクトリ>
```

#### アップロードオプション

- `-i, --input <directory>`: 入力ディレクトリのパス（デフォルト: ./compressed-images）
- `-v, --verbose`: 詳細なログを出力

### ヘルプの表示

各コマンドのヘルプを表示するには：

```bash
# 全体のヘルプ
npx tiny-pic --help

# 圧縮コマンドのヘルプ
npx tiny-pic compress --help

# アップロードコマンドのヘルプ
npx tiny-pic upload --help
```

## 🧪 開発

### テストの実行

```bash
npm test
```

### 直接実行

開発中は以下のコマンドで直接実行できます：

```bash
npx ts-node ./src/index.ts [コマンド] [オプション]
```

### TypeScript ファイルのコンパイル

```bash
npm run build
```

## 📝 ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で提供されています。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
