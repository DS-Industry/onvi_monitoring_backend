import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPresignedUrlDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(604800)
  @Transform(({ value }) => parseInt(value))
  expiresIn?: number = 3600;
}

export class PutPresignedUrlDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(604800)
  @Transform(({ value }) => parseInt(value))
  expiresIn?: number = 3600;
}
