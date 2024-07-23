import { IsNotEmpty, IsString } from 'class-validator';

export class GetByIdClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
}
