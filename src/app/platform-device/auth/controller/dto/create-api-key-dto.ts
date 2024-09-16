import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDeviceApiKeyDto {
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
}
