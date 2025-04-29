# tiny-pic

tiny-pic は、画像を圧縮し、AWS S3 にアップロードするための TypeScript ベースの CLI ツールです。このツールは、画像のサイズを効率的に削減し、クラウドストレージに簡単に保存できるように設計されています。

## 主な機能

- PNG 画像の高効率圧縮
- 圧縮画像の AWS S3 へのアップロード
- 詳細な圧縮率やアップロード結果のレポート

## 必要条件

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