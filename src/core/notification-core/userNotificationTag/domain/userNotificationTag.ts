import { BaseEntity } from '@utils/entity';

export interface UserNotificationTagProps {
  id?: number;
  name: string;
  color: string;
  authorUserId: number;
}

export class UserNotificationTag extends BaseEntity<UserNotificationTagProps> {
  constructor(props: UserNotificationTagProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set color(color: string) {
    this.props.color = color;
  }

  get authorUserId(): number {
    return this.props.authorUserId;
  }
}
