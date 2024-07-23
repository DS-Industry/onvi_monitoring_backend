import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAvatarAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
