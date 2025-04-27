# tiny-pic

tiny-pic は、画像を圧縮し、AWS S3 にアップロードするための TypeScript ベースの CLI ツールです。このツールは、画像のサイズを効率的に削減し、クラウドストレージに簡単に保存できるように設計されています。

## 主な機能

- PNG 画像の高効率圧縮
- 圧縮画像の AWS S3 へのアップロード
- 詳細な圧縮率やアップロード結果のレポート

## インストール

以下のコマンドを実行して依存関係をインストールしてください：

```bash
npm install
```

## 使用方法

### 画像の圧縮

以下のコマンドで指定したディレクトリ内の PNG 画像を圧縮できます：

```bash
npx tiny-pic compress --input <入力ディレクトリ> --output <出力ディレクトリ>
```

例：

```bash
npx tiny-pic compress --input ./images --output ./compressed-images
```

#### 圧縮オプション

- `-i, --input <directory>`: 入力ディレクトリのパス（デフォルト: カレントディレクトリ）
- `-o, --output <directory>`: 出力ディレクトリのパス（デフォルト: ./compressed-images）
- `-l, --level <level>`: 圧縮レベル（1-9、デフォルト: 9）
- `-a, --adaptive-filtering <boolean>`: 適応フィルタリングの使用（true/false、デフォルト: true）
- `-v, --verbose`: 詳細なログを出力

### 圧縮画像の S3 アップロード

以下のコマンドで圧縮された画像を AWS S3 にアップロードできます：

```bash
npx tiny-pic upload --input <圧縮画像ディレクトリ>
```

例：

```bash
npx tiny-pic upload --input ./compressed-images
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

## 環境変数の設定

AWS S3 にアップロードするためには、以下の環境変数を `.env` ファイルに設定する必要があります：

```
AWS_ACCESS_KEY_ID=<あなたのAWSアクセスキー>
AWS_SECRET_ACCESS_KEY=<あなたのAWSシークレットキー>
AWS_REGION=<S3のリージョン>
AWS_BUCKET_NAME=<S3のバケット名>
AWS_UPLOAD_PREFIX=<アップロード先のプレフィックス>（オプション、デフォルト: images/）
```

## 開発

### 直接実行

開発中は以下のコマンドで直接実行できます：

```bash
npx ts-node ./src/index.ts [コマンド] [オプション]
```

### テストの実行

以下のコマンドでテストを実行できます：

```bash
npx jest
```

### TypeScript ファイルのコンパイル

以下のコマンドを使用してください：

```bash
npx tsc
```

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で提供されています。