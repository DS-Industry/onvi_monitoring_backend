import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CardTransferDto {
  @IsString()
  @IsNotEmpty()
  devNomer: string;

  @IsNumber()
  @Min(0)
  balance: number;
}
