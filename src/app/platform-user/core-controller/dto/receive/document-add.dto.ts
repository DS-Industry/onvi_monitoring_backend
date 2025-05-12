import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => parseInt(value, 10))
  organizationId: number;
}
