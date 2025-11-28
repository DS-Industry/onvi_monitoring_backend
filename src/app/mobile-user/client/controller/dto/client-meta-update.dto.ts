import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClientMetaUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'metaId is required' })
  metaId: number;

  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsNumber()
  @IsOptional()
  deviceId?: number;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  platformVersion?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  appToken?: string;
}
