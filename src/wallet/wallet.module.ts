import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Module({
  providers: [WalletService],
  controllers: [],
})
export class WalletModule {}
