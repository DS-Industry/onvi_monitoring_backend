import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
