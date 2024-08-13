import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateApiKeyDto {
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organiationId: number;
}
