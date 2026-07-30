import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorizerService } from './authorizer.service';
import { NotificationService } from './notification.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: 'AUTHORIZER_API_URL',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('AUTHORIZER_API_URL'),
      inject: [ConfigService],
    },
    {
      provide: 'NOTIFICATION_API_URL',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('NOTIFICATION_API_URL'),
      inject: [ConfigService],
    },
    AuthorizerService,
    NotificationService,
  ],
  exports: [AuthorizerService, NotificationService],
})
export class ExternalModule {}
