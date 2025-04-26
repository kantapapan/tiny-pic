import { Command } from 'commander';
import path from 'path';
import { CompressImages } from '../../../application/CompressImages';
import { LocalImageRepository } from '../../../infrastructure/LocalImageRepository';
import { SharpImageCompressor } from '../../../infrastructure/SharpImageCompressor';
import { loadConfig } from '../../../infrastructure/config';
import { logger } from '../../utils/logger';

export function registerCompressCommand(program: Command): void {
  program
    .command('compress')
    .description('PNG画像を圧縮します')
    .option('-i, --input <directory>', '入力ディレクトリのパス')
    .option('-o, --output <directory>', '出力ディレクトリのパス')
    .option('-l, --level <level>', '圧縮レベル (1-9)', value => parseInt(value, 10))
    .option('-a, --adaptive-filtering <boolean>', '適応フィルタリング (true/false)')
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
        const inputDir = options.input ? path.resolve(options.input) : process.cwd();
        logger.debug(`入力ディレクトリ: ${inputDir}`);

        // 出力ディレクトリのチェック
        const outputDir = options.output ? path.resolve(options.output) : config.defaultOutputDir;
        logger.debug(`出力ディレクトリ: ${outputDir}`);

        // 圧縮レベルのチェック
        const compressionLevel = options.level !== undefined 
          ? Math.max(1, Math.min(9, options.level)) 
          : config.defaultCompressionLevel;
        logger.debug(`圧縮レベル: ${compressionLevel}`);

        // 適応フィルタリングのチェック
        const adaptiveFiltering = options.adaptiveFiltering !== undefined
          ? options.adaptiveFiltering === 'true' || options.adaptiveFiltering === true
          : config.defaultAdaptiveFiltering;
        logger.debug(`適応フィルタリング: ${adaptiveFiltering}`);

        // リポジトリとサービスの初期化
        const repository = new LocalImageRepository();
        const compressor = new SharpImageCompressor(compressionLevel, adaptiveFiltering);

        // ユースケースの初期化
        const compressImages = new CompressImages(repository, compressor);

        logger.start('画像の圧縮');
        const result = await compressImages.execute({
          inputDir,
          outputDir,
          compressionLevel,
          adaptiveFiltering
        });
        
        // 結果の表示
        logger.complete('画像の圧縮');
        logger.info(`処理結果: 
  - 合計画像数: ${result.totalImages}
  - 圧縮成功数: ${result.compressedImages}
  - 元画像合計サイズ: ${formatBytes(result.totalOriginalSize)}
  - 圧縮後合計サイズ: ${formatBytes(result.totalCompressedSize)}
  - 平均圧縮率: ${result.averageCompressionRatio.toFixed(2)}%
  - 出力ディレクトリ: ${outputDir}
`);
      } catch (error) {
        logger.fail('画像の圧縮', error);
        process.exit(1);
      }
    });
}

/**
 * バイト数を人間が読みやすい形式に変換
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}