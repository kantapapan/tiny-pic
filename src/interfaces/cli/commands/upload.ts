import { Command } from 'commander';
import path from 'path';
import { UploadImages } from '../../../application/UploadImages';
import { LocalImageRepository } from '../../../infrastructure/LocalImageRepository';
import { S3Uploader } from '../../../infrastructure/S3Uploader';
import { loadConfig } from '../../../infrastructure/config';
import { logger } from '../../utils/logger';

export function registerUploadCommand(program: Command): void {
  program
    .command('upload')
    .description('圧縮済み画像をAWS S3にアップロードします')
    .option('-i, --input <directory>', '入力ディレクトリのパス（圧縮済み画像があるディレクトリ）')
    .option('-v, --verbose', '詳細なログを出力する')
    .action(async (options) => {
      try {
        // 詳細ログモードの場合、ログレベルをDEBUGに設定
        if (options.verbose) {
          logger.setLevel(0); // DEBUG
        }

        // 設定をロード
        const config = await loadConfig();

        // 入力ディレクトリのチェック
        const inputDir = options.input ? path.resolve(options.input) : path.resolve(process.cwd(), 'compressed-images');
        logger.debug(`入力ディレクトリ: ${inputDir}`);

        // AWS設定をチェック
        if (!config.aws.bucketName) {
          logger.fail('AWS S3アップロード', new Error('有効なAWS設定がありません。.envファイルを確認してください。'));
          process.exit(1);
        }

        // リポジトリとアップローダーの初期化
        const repository = new LocalImageRepository();
        const uploader = new S3Uploader(config.aws);

        // ユースケースの初期化
        const uploadImages = new UploadImages(repository, uploader);

        logger.start('画像のアップロード');
        const result = await uploadImages.execute({
          inputDir
        });
        
        // 結果の表示
        logger.complete('画像のアップロード');
        logger.info(`処理結果: 
  - 合計画像数: ${result.totalImages}
  - アップロード成功数: ${result.uploadedImages}
  - アップロード先バケット: ${config.aws.bucketName}
`);

        // アップロードされたURLを表示
        if (result.uploadedUrls.length > 0) {
          logger.info('アップロードされた画像のURL:');
          result.uploadedUrls.forEach(url => {
            logger.info(`  - ${url}`);
          });
        }
      } catch (error) {
        logger.fail('画像のアップロード', error);
        process.exit(1);
      }
    });
}