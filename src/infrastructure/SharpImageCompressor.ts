import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { Image } from '../domain/models/Image';
import { ImageCompressor } from '../domain/services/ImageCompressor';

/**
 * Sharpライブラリを使用した画像圧縮サービスの実装
 */
export class SharpImageCompressor implements ImageCompressor {
  constructor(
    private readonly compressionLevel: number = 9,
    private readonly adaptiveFiltering: boolean = true,
    private readonly outputFormat: 'png' | 'jpeg' | 'webp' = 'png',
    private readonly quality: number = 80, // JPEG/WebPの品質（1-100）
    private readonly outputDir: string = './compressed' // 圧縮後のファイルを保存するディレクトリ
  ) {}

  /**
   * 画像を圧縮する
   */
  async compress(image: Image): Promise<Buffer> {
    try {
      const imageBuffer = await fs.readFile(image.originalPath);

      let sharpInstance = sharp(imageBuffer);

      // フォーマットに応じた設定
      if (this.outputFormat === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({
          quality: this.quality,
          force: true
        });
      } else if (this.outputFormat === 'webp') {
        sharpInstance = sharpInstance.webp({
          quality: this.quality,
          force: true
        });
      } else {
        sharpInstance = sharpInstance.png({
          compressionLevel: this.compressionLevel,
          adaptiveFiltering: this.adaptiveFiltering,
          force: true,
          palette: true, // パレットベースの画像に変換して圧縮率向上
          quality: this.quality // 必要な色数を指定
        });
      }

      // 出力ファイル名の拡張子を変更
      const outputExtension = this.outputFormat === 'jpeg' ? '.jpeg' : this.outputFormat === 'webp' ? '.webp' : '.png';
      const outputFileName = path.basename(image.originalPath, path.extname(image.originalPath)) + outputExtension;
      const outputFilePath = path.join(this.outputDir, outputFileName);

      // 出力ディレクトリが存在しない場合は作成
      await fs.mkdir(this.outputDir, { recursive: true });

      // 圧縮後のファイルを保存
      await sharpInstance.toFile(outputFilePath);

      const compressedBuffer = await fs.readFile(outputFilePath);
      return compressedBuffer;
    } catch (error) {
      console.error('画像の圧縮中にエラーが発生しました:', error);
      throw error;
    }
  }
}