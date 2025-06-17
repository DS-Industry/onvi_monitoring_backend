import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserNotificationType } from '@prisma/client';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';

export class UserNotificationFindAllFilterDto {
  @IsOptional()
  @IsEnum(UserNotificationType)
  type?: UserNotificationType;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  tagId?: number;
  @IsEnum(ReadStatus)
  @IsOptional()
  readStatus?: ReadStatus;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
