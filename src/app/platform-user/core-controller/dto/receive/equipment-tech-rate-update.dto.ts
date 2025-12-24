import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from "class-transformer";

export class EquipmentTechRateUpdateDto {
  @IsArray()
  valueData: itemValueDto[];
}

export class itemValueDto {
  @IsNumber()
  @IsNotEmpty({ message: 'programTechRateId is required' })
  programTechRateId: number;
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'literRate is required' })
  literRate: number;
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'concentration is required' })
  concentration: number;
}
