import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,

    DatabaseModule,

    WalletModule,
  ],
  controllers: [],
  providers: [WalletService],
})
export class AppModule {}
