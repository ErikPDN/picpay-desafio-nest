import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { wallets } from 'src/database/schema';
import * as schema from 'src/database/schema';
import { eq, sql } from 'drizzle-orm';

type DbExecutor = NodePgDatabase<typeof schema>;

@Injectable()
export class WalletService {
  async debit(userId: number, amount: number, executor: DbExecutor) {
    this.assertPositiveAmount(amount);

    const wallet = await this.getWalletByUserId(userId, executor);

    if (this.toCents(wallet.balance) < this.toCents(amount)) {
      throw new BadRequestException(
        `Insufficient balance in wallet for userId: ${userId}`,
      );
    }

    const [updatedWallet] = await executor
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId))
      .returning();

    return updatedWallet;
  }

  async credit(userId: number, amount: number, executor: DbExecutor) {
    this.assertPositiveAmount(amount);

    await this.getWalletByUserId(userId, executor);

    const [updatedWallet] = await executor
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId))
      .returning();

    return updatedWallet;
  }

  async lockByUserId(userId: number, executor: DbExecutor) {
    return this.getWalletByUserId(userId, executor);
  }

  private async getWalletByUserId(userId: number, executor: DbExecutor) {
    const [wallet] = await executor
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .for('update');

    if (!wallet) {
      throw new NotFoundException(`Wallet not found for userId: ${userId}`);
    }

    return wallet;
  }

  private assertPositiveAmount(amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
  }

  private toCents(value: number | string): number {
    return Math.round(Number(value) * 100);
  }
}
