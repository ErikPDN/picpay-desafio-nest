import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ForbiddenException, Inject } from '@nestjs/common';
import { catchError, firstValueFrom, of } from 'rxjs';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject('NOTIFICATION_API_URL') private readonly apiUrl: string,
  ) {}

  async notify(userId: number, message: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(this.apiUrl, { userId, message }).pipe(
        catchError((error) => {
          this.logger.error(
            `Error while sending notification: ${error.message}`,
          );
          return of(null);
        }),
      ),
    );
  }
}
