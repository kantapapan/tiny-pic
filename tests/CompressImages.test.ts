import { CompressImages } from '../src/application/CompressImages';
import { LocalImageRepository } from '../src/infrastructure/LocalImageRepository';
import { SharpImageCompressor } from '../src/infrastructure/SharpImageCompressor';
import fs from 'fs';
import path from 'path';

describe('CompressImages', () => {
  const inputDir = 'tests/assets';
  const outputDir = 'compressed-images';

  beforeAll(() => {
    console.log(`Creating output directory at: ${outputDir}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    } else {
      console.log('Output directory already exists.');
    }
  });

  // afterAll(() => {
  //   // テスト後に出力ディレクトリをクリーンアップ
  //   fs.rmSync(outputDir, { recursive: true, force: true });
  // });

  it('should compress PNG images in the specified directory', async () => {
    const imageRepository = new LocalImageRepository();
    const imageCompressor = new SharpImageCompressor();
    const compressImages = new CompressImages(imageRepository, imageCompressor);

    const result = await compressImages.execute({
      inputDir,
      outputDir
    });

    expect(result.totalImages).toBe(1);
    expect(result.compressedImages).toBe(1);
    expect(result.totalOriginalSize).toBeGreaterThan(0);
    expect(result.totalCompressedSize).toBeGreaterThan(0);
    expect(result.averageCompressionRatio).toBeGreaterThan(0);

    // 圧縮されたファイルが存在することを確認
    const compressedFilePath = path.join(outputDir, 'test.png');
    expect(fs.existsSync(compressedFilePath)).toBe(true);
  });
});