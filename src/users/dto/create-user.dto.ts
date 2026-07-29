import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export const UserType = {
  USER: 'user',
  MERCHANT: 'merchant',
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

export class CreateUserDto {
  @IsString({ message: 'Full name must be a string' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName!: string;

  @IsString({ message: 'CPF/CNPJ must be a string' })
  @MinLength(11, { message: 'CPF/CNPJ must be at least 11 characters long' })
  cpfCnpj!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsEnum(UserType, { message: 'Type must be either "user" or "merchant"' })
  type!: UserType;
}
