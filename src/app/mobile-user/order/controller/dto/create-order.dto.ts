import { Optional } from '@nestjs/common';
import { IsNumber, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export class CreateOrderDto {
  @IsNumber()
  @IsDefined()
  sum: number;

  @IsNumber()
  @IsDefined()
  rewardPointsUsed: number;

  @IsOptional()
  @IsNumber()
  sumBonus?: number;

  @Optional()
  promoCodeId?: number;

  @IsNumber()
  @IsDefined()
  carWashId: number;

  @IsNumber()
  @IsDefined()
  carWashDeviceId: number;

  @IsNumber()
  @IsDefined()
  bayNumber: number;

  @Optional()
  bayType?: DeviceType;

  @Optional()
  err?: number;
}
