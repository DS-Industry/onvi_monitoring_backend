import { UserNotificationType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface UserNotificationProps {
  id?: number;
  notificationId: number;
  userId: number;
  sendAt: Date;
  openingAt?: Date;
  type?: UserNotificationType;
}

export class UserNotification extends BaseEntity<UserNotificationProps> {
  constructor(props: UserNotificationProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get notificationId(): number {
    return this.props.notificationId;
  }

  set notificationId(notificationId: number) {
    this.props.notificationId = notificationId;
  }

  get userId(): number {
    return this.props.userId;
  }

  set userId(userId: number) {
    this.props.userId = userId;
  }

  get sendAt(): Date {
    return this.props.sendAt;
  }

  get openingAt(): Date {
    return this.props.openingAt;
  }

  set openingAt(openingAt: Date) {
    this.props.openingAt = openingAt;
  }

  get type(): UserNotificationType {
    return this.props.type;
  }

  set type(type: UserNotificationType) {
    this.props.type = type;
  }
}
