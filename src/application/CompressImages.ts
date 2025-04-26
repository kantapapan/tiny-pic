import { ImageCompressor } from '../domain/services/ImageCompressor';
import { IImageRepository } from '../domain/repositories/IImageRepository';
import { CompressImagesOptions, CompressionResult } from './types';

/**
 * 画像圧縮ユースケース
 */
export class CompressImages {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly imageCompressor: ImageCompressor
  ) {}

  /**
   * 指定ディレクトリ内のPNG画像を圧縮する
   */
  async execute(options: CompressImagesOptions): Promise<CompressionResult> {
    const { inputDir, outputDir } = options;
    
    // 指定ディレクトリから画像を取得
    const images = await this.imageRepository.findPngImages(inputDir);
    
    if (images.length === 0) {
      return {
        totalImages: 0,
        compressedImages: 0,
        totalOriginalSize: 0,
        totalCompressedSize: 0,
        averageCompressionRatio: 0
      };
    }

    let compressedCount = 0;
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    // 各画像を圧縮して保存
    for (const image of images) {
      try {
        // 画像を圧縮
        const compressedBuffer = await this.imageCompressor.compress(image);
        
        // 圧縮画像を保存
        const compressedImage = await this.imageRepository.saveCompressedImage(
          image,
          compressedBuffer,
          outputDir
        );
        
        if (compressedImage.compressedSize !== null) {
          compressedCount++;
          totalOriginalSize += image.originalSize;
          totalCompressedSize += compressedImage.compressedSize;
        }
      } catch (error) {
        console.error(`画像 ${image.originalPath} の圧縮中にエラーが発生しました:`, error);
      }
    }
    
    // 平均圧縮率を計算
    const averageCompressionRatio = 
      totalOriginalSize > 0 
        ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 10000) / 100
        : 0;
    
    return {
      totalImages: images.length,
      compressedImages: compressedCount,
      totalOriginalSize,
      totalCompressedSize,
      averageCompressionRatio
    };
  }
}