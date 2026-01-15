import { IsString, IsNotEmpty, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentObjectDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @IsOptional()
  metadata?: {
    orderId?: string;
    order_id?: string;
    [key: string]: any;
  };

  [key: string]: any;
}

export class YooKassaWebhookDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PaymentObjectDto)
  object: PaymentObjectDto;

  [key: string]: any;
}
