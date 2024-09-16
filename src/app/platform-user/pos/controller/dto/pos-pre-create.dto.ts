import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressCreateDto } from '@platform-user/pos/controller/dto/address-create.dto';

export class PosPreCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsOptional()
  monthlyPlan?: string;
  @IsString()
  @IsOptional()
  posMetaData?: string;
  @IsString()
  @IsNotEmpty({ message: 'Timezone is required' })
  timezone: string;
  @Type(() => AddressCreateDto)
  @ValidateNested()
  address: AddressCreateDto;
  @IsString()
  @IsOptional()
  image?: string;
  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
  @IsString()
  @IsNotEmpty({ message: 'OrganizationId is required' })
  organizationId: string;
}
