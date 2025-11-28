import { UserNotificationType } from '@prisma/client';

export interface UserNotificationUpdateDto {
  readStatus?: ReadStatus;
  type?: UserNotificationType;
  tagIds?: number[];
}

export enum ReadStatus {
  READ = 'READ',
  NOT_READ = 'NOT_READ',
}
