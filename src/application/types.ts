export interface CompressImagesOptions {
  inputDir: string;
  outputDir: string;
  compressionLevel?: number; // オプション: 圧縮レベル（1-9）
  adaptiveFiltering?: boolean; // オプション: 適応フィルタリング
}

export interface UploadImagesOptions {
  inputDir: string; // アップロード対象の圧縮済み画像ディレクトリ
}

export interface CompressionResult {
  totalImages: number;
  compressedImages: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageCompressionRatio: number;
}

export interface UploadResult {
  totalImages: number;
  uploadedImages: number;
  uploadedUrls: string[];
}