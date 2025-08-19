import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReadStatus } from '@notification/userNotification/use-case/dto/userNotification-update.dto';
import { UserNotificationType } from "@notification/notification/domain/userNotificationType";

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
