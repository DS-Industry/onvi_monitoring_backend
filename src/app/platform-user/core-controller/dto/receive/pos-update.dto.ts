import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AddressCreateDto } from '@platform-user/core-controller/dto/receive/address-create.dto';
import { CarWashPosType } from '@pos/carWashPos/domain/carWashPosType';

export class PosUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  posMetaData?: string;

  @Transform(({ value }) => {
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @ValidateNested()
  @Type(() => AddressCreateDto)
  @IsOptional()
  address?: AddressCreateDto;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  organizationId?: number;

  @IsEnum(CarWashPosType)
  @IsOptional()
  carWashPosType?: CarWashPosType;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  minSumOrder?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  maxSumOrder?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  stepSumOrder?: number;
}
