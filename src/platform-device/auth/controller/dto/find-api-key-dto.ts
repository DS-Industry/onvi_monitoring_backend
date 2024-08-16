import { IsNotEmpty } from 'class-validator';

export class FindDeviceApiKeysByKeyDto {
  @IsNotEmpty()
  key: string;
}
