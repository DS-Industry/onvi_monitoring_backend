import { Optional } from '@nestjs/common';
import { IsNumber, IsDefined, IsOptional } from 'class-validator';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export class CreateOrderDto {
  @IsNumber()
  @IsDefined()
  sum: number;

  @IsNumber()
  @IsOptional()
  rewardPointsUsed?: number;

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

  @Optional()
  bayType?: DeviceType;

  @Optional()
  err?: number;
}
