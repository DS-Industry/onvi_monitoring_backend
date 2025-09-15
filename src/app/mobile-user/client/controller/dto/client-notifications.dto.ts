import { IsBoolean } from 'class-validator';

export class ClientNotificationsDto {
  @IsBoolean()
  notification: boolean;
}
