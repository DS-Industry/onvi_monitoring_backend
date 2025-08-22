import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContractType } from '@loyalty/mobile-user/client/domain/contractType';

export class ClientFilterDto {
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  contractType: ContractType | '*';
  @IsNotEmpty({ message: 'workerCorporateId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  workerCorporateId: number | '*';
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[\[\]\s]/g, '');
      return cleanedValue
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)); // Удаляем NaN
    }
    return value;
  })
  tagIds: number[];
  @IsString()
  @IsOptional()
  phone?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;

  @IsOptional()
  @IsString()
  registrationFrom?: string;

  @IsOptional()
  @IsString()
  registrationTo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
