import { UserNotificationType } from "@prisma/client";
import { UserNotificationTag } from "@notification/userNotificationTag/domain/userNotificationTag";

export interface FullDataUserNotificationDto {
  id: number;
  notificationId: number;
  heading: string;
  body: string;
  authorId?: number;
  sendAt: Date;
  openingAt?: Date;
  type?: UserNotificationType;
  tags: UserNotificationTagDto[];
}

export interface UserNotificationTagDto {
  id: number;
  name: string;
  color: string;
}