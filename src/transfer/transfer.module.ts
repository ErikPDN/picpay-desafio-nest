import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { ExternalModule } from 'src/external/external.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, WalletModule, ExternalModule],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}
