import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AddressCreateDto } from '@platform-user/core-controller/dto/receive/address-create.dto';
import { CarWashPosType } from '@pos/carWashPos/domain/carWashPosType';

export class PosCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'timeWork is required' })
  timeWork: string;
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
  address: AddressCreateDto;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'OrganizationId is required' })
  organizationId: number;
  @IsEnum(CarWashPosType)
  @IsNotEmpty({ message: 'Type pos is required' })
  carWashPosType: CarWashPosType;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'minSumOrder is required' })
  minSumOrder: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'maxSumOrder is required' })
  maxSumOrder: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'stepSumOrder is required' })
  stepSumOrder: number;
}
