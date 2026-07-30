import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users, wallets } from 'src/database/schema';
import { eq, or } from 'drizzle-orm';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { User } from 'src/database/schema/users';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(userDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const cpfCnpjFormatted = userDto.cpfCnpj.replaceAll(/\D/g, '');

    const existingUser = await this.dbService.db
      .select({ id: users.id })
      .from(users)
      .where(
        or(eq(users.cpfCnpj, cpfCnpjFormatted), eq(users.email, userDto.email)),
      );

    if (existingUser.length > 0) {
      throw new ConflictException(
        'User with the same CPF/CNPJ or email already exists',
      );
    }

    return this.dbService.db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          fullName: userDto.fullName,
          cpfCnpj: cpfCnpjFormatted,
          email: userDto.email,
          password: userDto.password,
          type: userDto.type,
        })
        .returning();

      await tx.insert(wallets).values({
        userId: newUser.id,
        balance: '0',
      });

      return this.toResponseDto(newUser);
    });
  }

  async findById(id: number): Promise<CreateUserResponseDto | null> {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user ? this.toResponseDto(user) : null;
  }

  private toResponseDto(user: User): CreateUserResponseDto {
    const { password, ...rest } = user;
    return rest;
  }
}
