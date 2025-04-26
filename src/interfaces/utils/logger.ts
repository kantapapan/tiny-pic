/**
 * ログレベルを定義
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * シンプルなロガー
 */
export class Logger {
  private level: LogLevel;
  
  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }
  
  /**
   * ログレベルを設定
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }
  
  /**
   * デバッグレベルのログを出力
   */
  debug(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  /**
   * 情報レベルのログを出力
   */
  info(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  /**
   * 警告レベルのログを出力
   */
  warn(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  /**
   * エラーレベルのログを出力
   */
  error(message: string, ...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  /**
   * 処理の開始を示すログを出力
   */
  start(task: string): void {
    this.info(`🚀 ${task}を開始します...`);
  }
  
  /**
   * 処理の完了を示すログを出力
   */
  complete(task: string): void {
    this.info(`✅ ${task}が完了しました`);
  }
  
  /**
   * 処理の失敗を示すログを出力
   */
  fail(task: string, error?: any): void {
    this.error(`❌ ${task}が失敗しました`);
    if (error) {
      this.error(String(error));
    }
  }
}

// アプリケーション全体で使用するロガーのインスタンス
export const logger = new Logger();