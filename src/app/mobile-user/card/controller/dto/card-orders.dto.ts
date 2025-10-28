import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class HistOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}

export class AccountTransferDataDto {
  @IsString()
  devNomer: string;
}

export class AccountTransferDto {
  @IsString()
  devNumber: string;

  @Type(() => Number)
  @IsInt()
  sum: number;
}

export class AccountTransferDataResponseDto {
  devNumber: string;
  balance: number;
  monthlyLimit?: number;
}

