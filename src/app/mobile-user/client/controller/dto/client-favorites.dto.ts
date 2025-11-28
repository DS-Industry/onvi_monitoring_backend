import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClientFavoritesDto {
  @IsNumber()
  @IsNotEmpty({ message: 'carwashId is required' })
  carwashId: number;
}
