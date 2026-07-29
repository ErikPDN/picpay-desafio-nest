import { UserType } from './create-user.dto';

export class CreateUserResponseDto {
  id!: number;
  fullName!: string;
  cpfCnpj!: string;
  email!: string;
  type!: UserType;
  createdAt!: Date;
  updatedAt!: Date;
}
