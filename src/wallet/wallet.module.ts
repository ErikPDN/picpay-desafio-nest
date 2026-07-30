import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Module({
  providers: [WalletService],
  controllers: [],
  exports: [WalletService],
})
export class WalletModule {}
