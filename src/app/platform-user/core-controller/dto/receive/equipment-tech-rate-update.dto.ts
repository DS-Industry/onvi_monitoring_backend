import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class EquipmentTechRateUpdateDto {
  @IsArray()
  valueData: itemValueDto[];
}

export class itemValueDto {
  @IsNumber()
  @IsNotEmpty({ message: 'programTechRateId is required' })
  programTechRateId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'literRate is required' })
  literRate: number;
  @IsNumber()
  @IsNotEmpty({ message: 'concentration is required' })
  concentration: number;
}
