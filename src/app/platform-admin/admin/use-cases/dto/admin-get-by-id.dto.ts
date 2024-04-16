import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
