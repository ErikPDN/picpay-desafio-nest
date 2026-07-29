import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users, wallets } from 'src/database/schema';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(userDto: CreateUserDto) {
    const cpfCnpjFormatted = userDto.cpfCnpj.replaceAll(/\D/g, '');
  }
}
