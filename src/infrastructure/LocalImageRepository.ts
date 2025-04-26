import fs from 'fs/promises';
import path from 'path';
import { Image } from '../domain/models/Image';
import { IImageRepository } from '../domain/repositories/IImageRepository';

/**
 * ローカルファイルシステムを使用した画像リポジトリの実装
 */
export class LocalImageRepository implements IImageRepository {
  /**
   * 指定されたディレクトリからPNG画像を取得する
   */
  async findPngImages(directoryPath: string): Promise<Image[]> {
    try {
      const files = await fs.readdir(directoryPath);
      const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
      
      const images: Image[] = [];
      
      for (const file of pngFiles) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          const id = path.basename(file, '.png'); // 拡張子を除いたファイル名をIDとして使用
          
          images.push(new Image(
            id,
            filePath,
            null, // 未圧縮なのでnull
            null, // 未アップロードなのでnull
            stats.size,
            null // 未圧縮なのでnull
          ));
        }
      }
      
      return images;
    } catch (error) {
      console.error('ディレクトリからの画像取得中にエラーが発生しました:', error);
      return [];
    }
  }
  
  /**
   * 圧縮された画像を保存する
   */
  async saveCompressedImage(image: Image, compressedBuffer: Buffer, outputDir: string): Promise<Image> {
    try {
      // 出力ディレクトリが存在することを確認
      await fs.mkdir(outputDir, { recursive: true });
      
      // 出力ファイル名を生成
      const originalFileName = path.basename(image.originalPath);
      const outputFilePath = path.join(outputDir, originalFileName);
      
      // バッファをファイルに書き込み
      await fs.writeFile(outputFilePath, compressedBuffer);
      
      // 圧縮されたファイルのサイズを取得
      const stats = await fs.stat(outputFilePath);
      
      // 圧縮情報を含む新しいImageオブジェクトを返す
      return image.withCompression(outputFilePath, stats.size);
    } catch (error) {
      console.error('圧縮画像の保存中にエラーが発生しました:', error);
      return image; // エラー時は元の画像を返す
    }
  }
}