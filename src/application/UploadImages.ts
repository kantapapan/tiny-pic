import { IS3Uploader } from '../domain/repositories/IS3Uploader';
import { IImageRepository } from '../domain/repositories/IImageRepository';
import { UploadImagesOptions, UploadResult } from './types';

/**
 * 画像アップロードユースケース
 */
export class UploadImages {
  constructor(
    private readonly imageRepository: IImageRepository,
    private readonly s3Uploader: IS3Uploader
  ) {}

  /**
   * 指定ディレクトリ内の圧縮済みPNG画像をS3にアップロードする
   */
  async execute(options: UploadImagesOptions): Promise<UploadResult> {
    const { inputDir } = options;
    
    // 指定ディレクトリから画像を取得
    const images = await this.imageRepository.findPngImages(inputDir);
    
    if (images.length === 0) {
      return {
        totalImages: 0,
        uploadedImages: 0,
        uploadedUrls: []
      };
    }

    let uploadedCount = 0;
    const uploadedUrls: string[] = [];
    
    // 各画像をアップロード
    for (const image of images) {
      try {
        // 圧縮画像をS3にアップロード
        const uploadedImage = await this.s3Uploader.uploadImage(image);
        
        if (uploadedImage.s3Url) {
          uploadedCount++;
          uploadedUrls.push(uploadedImage.s3Url);
        }
      } catch (error) {
        console.error(`画像 ${image.originalPath} のアップロード中にエラーが発生しました:`, error);
      }
    }
    
    return {
      totalImages: images.length,
      uploadedImages: uploadedCount,
      uploadedUrls
    };
  }
}