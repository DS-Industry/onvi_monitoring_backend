import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetByIdAdminDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
}
