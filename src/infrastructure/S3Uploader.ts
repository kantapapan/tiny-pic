import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { IS3Uploader } from '../domain/repositories/IS3Uploader';
import { Image } from '../domain/models/Image';
import { AwsConfig } from './config';

/**
 * AWS S3へのアップロード機能の実装
 */
export class S3Uploader implements IS3Uploader {
  private s3Client: S3Client;
  
  constructor(private readonly config: AwsConfig) {
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    });
  }
  
  /**
   * 画像をS3にアップロードする
   */
  async uploadImage(image: Image): Promise<Image> {
    // 圧縮された画像が存在しない場合は元の画像をアップロード対象とする
    const uploadPath = image.compressedPath || image.originalPath;
    
    try {
      // 画像ファイルの内容を読み込み
      const fileBuffer = await fs.readFile(uploadPath);
      
      // S3にアップロードするためのパスを決定
      const fileName = path.basename(uploadPath);
      const s3Key = `${this.config.uploadPrefix}${fileName}`;
      
      // S3アップロードコマンドの作成
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: 'image/png'
      });
      
      // アップロードの実行
      await this.s3Client.send(command);
      
      // アップロード後のURL（最終的にはこれがWebから直接アクセス可能なURL）
      const s3Url = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${s3Key}`;
      
      // アップロード情報を含む新しいImageオブジェクトを返す
      return image.withUpload(s3Url);
    } catch (error) {
      console.error('S3へのアップロード中にエラーが発生しました:', error);
      return image; // エラー時は元の画像を返す
    }
  }
}