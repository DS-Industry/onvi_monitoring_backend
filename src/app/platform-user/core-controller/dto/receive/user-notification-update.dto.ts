import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';
import { UserNotificationType } from '@notification/notification/domain/userNotificationType';

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
