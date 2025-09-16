import { IsString, IsNotEmpty } from 'class-validator';

export class CardTransferDataDto {
  @IsString()
  @IsNotEmpty()
  devNomer: string;
}
