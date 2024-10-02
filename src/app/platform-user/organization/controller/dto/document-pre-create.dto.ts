import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from "class-transformer";

export class CreatePreDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => parseInt(value, 10))
  organizationId: number;
  @IsString()
  @IsNotEmpty({ message: 'rateVat is required' })
  rateVat: string;
  @IsString()
  @IsNotEmpty({ message: 'inn is required' })
  inn: string;
  @IsString()
  @IsNotEmpty({ message: 'fullName is required' })
  fullName: string;
  @IsString()
  @IsNotEmpty({ message: 'okpo is required' })
  okpo: string;
  @IsString()
  @IsNotEmpty({ message: 'kpp is required' })
  kpp: string;
  @IsString()
  @IsNotEmpty({ message: 'addressRegistration is required' })
  addressRegistration: string;
  @IsString()
  @IsNotEmpty({ message: 'ogrn is required' })
  ogrn: string;
  @IsString()
  @IsNotEmpty({ message: 'bik is required' })
  bik: string;
  @IsString()
  @IsNotEmpty({ message: 'correspondentAccount is required' })
  correspondentAccount: string;
  @IsString()
  @IsNotEmpty({ message: 'bank is required' })
  bank: string;
  @IsString()
  @IsNotEmpty({ message: 'settlementAccount is required' })
  settlementAccount: string;
  @IsString()
  @IsNotEmpty({ message: 'address is required' })
  address: string;
}
