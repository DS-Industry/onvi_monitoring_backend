import { IsBoolean, IsEmail, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class AccountClientUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  avatar?: number;

  @IsOptional()
  @IsBoolean()
  is_notifications_enabled?: boolean;
}
