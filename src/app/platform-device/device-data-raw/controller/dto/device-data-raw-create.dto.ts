import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceDataRawCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'data is required' })
  data: string;
}
