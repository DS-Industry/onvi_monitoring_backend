import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadAvatarClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
