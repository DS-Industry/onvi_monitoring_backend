import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
