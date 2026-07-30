import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ForbiddenException, Inject } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject('AUTHORIZER_API_URL') private readonly apiUrl: string,
  ) {}

  async authorize(): Promise<void> {
    const response = await firstValueFrom(
      this.httpService.get(this.apiUrl).pipe(
        catchError((error) => {
          this.logger.error(
            `Error while contacting the authorizer API: ${error.message}`,
          );
          throw new ForbiddenException('Authorization failed');
        }),
      ),
    );

    const authorized =
      response.data?.data?.authorized === true ||
      response.data?.status === 'success';

    if (!authorized) {
      this.logger.warn('Authorization denied by the authorizer API');
      throw new ForbiddenException('Authorization denied');
    }
  }
}
