import { CompressImages } from '../src/application/CompressImages';
import { LocalImageRepository } from '../src/infrastructure/LocalImageRepository';
import { SharpImageCompressor } from '../src/infrastructure/SharpImageCompressor';
import fs from 'fs';
import path from 'path';

describe('CompressImages', () => {
  // テスト用の入出力ディレクトリ設定
  const inputDir = 'tests/assets/single-image';
  const outputDir = 'compressed';

  beforeAll(() => {
    // 出力ディレクトリを作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  });

  // テスト後に出力ディレクトリをクリーンアップする場合はコメントを外す
  // afterAll(() => {
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
    const compressedFilePath = path.join(outputDir, 'about-margiela.png');
    expect(fs.existsSync(compressedFilePath)).toBe(true);
  });

  it('should compress images to JPEG format with specified quality', async () => {
    const imageRepository = new LocalImageRepository();
    const imageCompressor = new SharpImageCompressor(9, true, 'jpeg', 75); // JPEG形式で品質75
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

    const compressedFilePath = path.join(outputDir, 'about-margiela.jpeg');
    expect(fs.existsSync(compressedFilePath)).toBe(true);
  });

  it('should compress images to WebP format with specified quality', async () => {
    const imageRepository = new LocalImageRepository();
    const imageCompressor = new SharpImageCompressor(9, true, 'webp', 80); // WebP形式で品質80
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

    const compressedFilePath = path.join(outputDir, 'about-margiela.webp');
    expect(fs.existsSync(compressedFilePath)).toBe(true);
  });
});