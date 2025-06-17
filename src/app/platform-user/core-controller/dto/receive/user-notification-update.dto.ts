import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';
import { UserNotificationType } from '@prisma/client';

export class UserNotificationUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userNotificationId is required' })
  userNotificationId: number;
  @IsEnum(ReadStatus)
  @IsOptional()
  readStatus?: ReadStatus;
  @IsEnum(UserNotificationType)
  @IsOptional()
  type?: UserNotificationType;
  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
