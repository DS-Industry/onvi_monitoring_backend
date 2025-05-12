import { IsNotEmpty, IsString } from 'class-validator';

export class TagCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'color is required' })
  color: string;
}
