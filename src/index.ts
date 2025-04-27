#!/usr/bin/env node

import { Command } from 'commander';
import { registerCompressCommand } from './interfaces/cli/commands/compress';
import { registerUploadCommand } from './interfaces/cli/commands/upload';
import { logger } from './interfaces/utils/logger';

// CLIプログラムの初期化
const program = new Command();

program
  .name('tiny-pic')
  .description('PNG画像を圧縮し、AWS S3にアップロードするためのCLIツール')
  .version('1.0.0');

// コマンドの登録
registerCompressCommand(program);
registerUploadCommand(program);

// エラーハンドリングの設定
program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed') {
    process.exit(0);
  }
  logger.error(`エラー: ${err.message}`);
  process.exit(1);
});

// CLIを実行
program.parse(process.argv);

// コマンドが指定されていない場合はヘルプを表示
if (!process.argv.slice(2).length) {
  program.outputHelp();
}