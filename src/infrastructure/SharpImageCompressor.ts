import sharp from 'sharp';
import fs from 'fs/promises';
import { Image } from '../domain/models/Image';
import { ImageCompressor } from '../domain/services/ImageCompressor';

/**
 * Sharpライブラリを使用した画像圧縮サービスの実装
 */
export class SharpImageCompressor implements ImageCompressor {
  constructor(
    private readonly compressionLevel: number = 9,
    private readonly adaptiveFiltering: boolean = true
  ) {}

  /**
   * 画像を圧縮する
   */
  async compress(image: Image): Promise<Buffer> {
    try {
      // 画像ファイルの内容を読み込み
      const imageBuffer = await fs.readFile(image.originalPath);
      
      // Sharpを使用して画像を圧縮
      const compressedBuffer = await sharp(imageBuffer)
        .png({
          compressionLevel: this.compressionLevel, // 1-9の間、高いほど圧縮率が高い
          adaptiveFiltering: this.adaptiveFiltering, // フィルタアルゴリズムの適応的選択
          force: true // 入力がPNGでなくても強制的にPNGとして出力
        })
        .withMetadata({ // メタデータを削除または追加
          // メタデータを最小限に保つ（基本的には削除）
        })
        .toBuffer();
      
      return compressedBuffer;
    } catch (error) {
      console.error('画像の圧縮中にエラーが発生しました:', error);
      throw error;
    }
  }
}