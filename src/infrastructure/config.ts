import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

// .envファイルをロード
dotenv.config();

export interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
  uploadPrefix: string;
}

export interface AppConfig {
  aws: AwsConfig;
  defaultCompressionLevel: number;
  defaultAdaptiveFiltering: boolean;
  defaultOutputDir: string;
}

// 環境変数があるかチェックする関数
const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が見つかりません。.envファイルを確認してください。`);
  }
  return value;
};

// 環境変数があればその値を、なければデフォルト値を返す関数
const getEnvOrDefault = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

// 設定をロード
export const loadConfig = async (): Promise<AppConfig> => {
  // 出力ディレクトリの存在確認と作成
  const defaultOutputDir = path.resolve(process.cwd(), 'compressed-images');
  try {
    await fs.mkdir(defaultOutputDir, { recursive: true });
  } catch (error) {
    console.warn(`出力ディレクトリの作成に失敗しました: ${error}`);
  }

  // AWS環境変数のチェック（必須）
  // S3へのアップロードを実行する場合のみエラーとする処理も可能
  let awsConfig: AwsConfig;
  try {
    awsConfig = {
      accessKeyId: getEnvOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getEnvOrThrow('AWS_SECRET_ACCESS_KEY'),
      region: getEnvOrThrow('AWS_REGION'),
      bucketName: getEnvOrThrow('AWS_BUCKET_NAME'),
      uploadPrefix: getEnvOrDefault('AWS_UPLOAD_PREFIX', 'images/')
    };
  } catch (error) {
    console.warn(`AWS設定の読み込みに失敗しました: ${error}`);
    awsConfig = {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'ap-northeast-1',
      bucketName: '',
      uploadPrefix: 'images/'
    };
  }

  return {
    aws: awsConfig,
    defaultCompressionLevel: Number(getEnvOrDefault('COMPRESSION_LEVEL', '9')),
    defaultAdaptiveFiltering: getEnvOrDefault('ADAPTIVE_FILTERING', 'true') === 'true',
    defaultOutputDir
  };
};