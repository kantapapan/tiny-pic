import { Image } from '../models/Image';

export interface IS3Uploader {
  /**
   * 画像をS3にアップロードする
   * @param image アップロード対象の画像
   */
  uploadImage(image: Image): Promise<Image>;
}