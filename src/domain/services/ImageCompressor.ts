import { Image } from '../models/Image';

/**
 * 画像圧縮サービスのインターフェース
 */
export interface ImageCompressor {
  /**
   * 画像を圧縮する
   * @param image 圧縮対象の画像
   * @returns 圧縮済みの画像データ（Buffer）
   */
  compress(image: Image): Promise<Buffer>;
}