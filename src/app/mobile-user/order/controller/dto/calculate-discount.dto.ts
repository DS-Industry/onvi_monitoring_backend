import { IsNumber, IsDefined, IsOptional } from 'class-validator';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export class CalculateDiscountDto {
  @IsNumber()
  @IsDefined()
  sum: number;

  @IsOptional()
  @IsNumber()
  promoCodeId?: number;

  @IsNumber()
  @IsDefined()
  carWashId: number;

  @IsNumber()
  @IsDefined()
  carWashDeviceId: number;

  @IsOptional()
  bayType?: DeviceType;

  @IsNumber()
  @IsOptional()
  rewardPointsUsed?: number;
}
