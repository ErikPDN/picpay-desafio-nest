import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthorizerService } from 'src/external/authorizer.service';
import { NotificationService } from 'src/external/notification.service';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UserType } from 'src/users/dto/create-user.dto';

@Injectable()
export class TransferService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly notificationService: NotificationService,
    private readonly usersService: UsersService,
    private readonly walletService: WalletService,
    private readonly authorizerService: AuthorizerService,
  ) {}

  async transfer(dto: CreateTransferDto) {
    const { payee, payer, value } = dto;

    if (payee === payer) {
      throw new BadRequestException('Payer and payee cannot be the same user');
    }

    const payerUser = await this.usersService.findById(payer);
    const payeeUser = await this.usersService.findById(payee);

    if (!payerUser) throw new BadRequestException('Payer user not found');
    if (!payeeUser) throw new BadRequestException('Payee user not found');

    if (payerUser.type === UserType.MERCHANT) {
      throw new BadRequestException('MERCHANT users cannot make transfers');
    }

    await this.authorizerService.authorize();

    const result = await this.dbService.db.transaction(async (tx) => {
      const [firstId, secondId] = [payer, payee].sort((a, b) => a - b);

      await this.walletService.lockByUserId(firstId, tx);
      await this.walletService.lockByUserId(secondId, tx);

      await this.walletService.debit(payer, value, tx);
      const creditedWallet = await this.walletService.credit(payee, value, tx);

      return creditedWallet;
    });

    await this.notificationService.notify(
      payee,
      `You have received a transfer of ${value} from user ${payer}`,
    );

    return { message: 'Transfer successful', creditedWallet: result };
  }
}
