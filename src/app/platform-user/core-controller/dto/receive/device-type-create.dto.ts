import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceTypeCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Code is required' })
  code: string;
}
