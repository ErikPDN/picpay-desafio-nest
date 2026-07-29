import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { TransferModule } from './transfer/transfer.module';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { UsersService } from './users.service';
import { WalletService } from './wallet.service';

@Module({
  imports: [UsersModule, WalletModule, TransferModule],
  controllers: [TransferController],
  providers: [TransferService, UsersService, WalletService],
})
export class AppModule {}
