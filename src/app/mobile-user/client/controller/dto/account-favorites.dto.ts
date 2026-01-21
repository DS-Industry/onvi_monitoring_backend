import { IsNotEmpty, IsNumber } from 'class-validator';

export class AccountFavoritesDto {
  @IsNumber()
  @IsNotEmpty({ message: 'carWashId is required' })
  carWashId: number;
}
