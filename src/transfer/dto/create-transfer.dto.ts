import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateTransferDto {
  @IsNumber({}, { message: 'Value must be a number' })
  @IsPositive({ message: 'Value must be a positive number' })
  value!: number;

  @IsInt({ message: 'Payer must be an integer' })
  payer!: number;

  @IsInt({ message: 'Payee must be an integer' })
  payee!: number;
}
