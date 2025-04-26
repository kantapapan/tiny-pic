export class Image {
  constructor(
    public readonly id: string, // ファイル名から生成されるID
    public readonly originalPath: string, // 元画像のパス
    public readonly compressedPath: string | null, // 圧縮済み画像のパス（未圧縮の場合はnull）
    public readonly s3Url: string | null, // アップロード後のS3 URL（未アップロードの場合はnull）
    public readonly originalSize: number, // 元画像のサイズ（バイト）
    public readonly compressedSize: number | null, // 圧縮後のサイズ（バイト）（未圧縮の場合はnull）
  ) {}

  /**
   * 圧縮処理結果を追加した新しいImageオブジェクトを返す
   */
  withCompression(compressedPath: string, compressedSize: number): Image {
    return new Image(
      this.id,
      this.originalPath,
      compressedPath,
      this.s3Url,
      this.originalSize,
      compressedSize
    );
  }

  /**
   * アップロード結果を追加した新しいImageオブジェクトを返す
   */
  withUpload(s3Url: string): Image {
    return new Image(
      this.id,
      this.originalPath,
      this.compressedPath,
      s3Url,
      this.originalSize,
      this.compressedSize
    );
  }

  /**
   * 圧縮率を計算して返す（%）
   */
  getCompressionRatio(): number | null {
    if (this.compressedSize === null || this.originalSize === 0) {
      return null;
    }
    const ratio = (1 - this.compressedSize / this.originalSize) * 100;
    return Math.round(ratio * 100) / 100; // 小数点第2位まで
  }
}