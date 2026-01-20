import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClientMetaUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'id is required' })
  id: number;

  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsString()
  @IsOptional()
  deviceId?: string;

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
