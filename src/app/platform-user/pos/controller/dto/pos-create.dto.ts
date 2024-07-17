import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressCreateDto } from '@platform-user/pos/controller/dto/address-create.dto';

export class PosCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNumber()
  @IsOptional()
  monthlyPlan?: number;
  @IsString()
  @IsOptional()
  posMetaData?: string;
  @IsNumber()
  @IsNotEmpty({ message: 'Timezone is required' })
  timezone: number;
  @Type(() => AddressCreateDto)
  @ValidateNested()
  address: AddressCreateDto;
  @IsString()
  @IsOptional()
  image?: string;
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
  @IsNumber()
  @IsNotEmpty({ message: 'OrganizationId is required' })
  organizationId: number;
}
