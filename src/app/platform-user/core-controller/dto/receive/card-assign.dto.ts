import { IsNumber, IsNotEmpty } from 'class-validator';

export class CardAssignDto {
  @IsNumber()
  @IsNotEmpty({ message: 'cardId is required' })
  cardId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'clientId is required' })
  clientId: number;
}
