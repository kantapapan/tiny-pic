import { Image } from '../models/Image';

export interface IImageRepository {
  /**
   * 指定されたディレクトリからPNG画像を取得する
   * @param directoryPath 取得対象のディレクトリパス
   */
  findPngImages(directoryPath: string): Promise<Image[]>;
  
  /**
   * 圧縮された画像を保存する
   * @param image 保存対象の画像
   * @param outputDir 出力先ディレクトリ
   */
  saveCompressedImage(image: Image, compressedBuffer: Buffer, outputDir: string): Promise<Image>;
}