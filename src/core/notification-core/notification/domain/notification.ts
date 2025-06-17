import { BaseEntity } from "@utils/entity";

export interface NotificationProps {
  id?: number;
  heading: string;
  body: string;
  scheduledSendAt?: Date;
  authorId?: number;
}

export class Notification extends BaseEntity<NotificationProps> {
  constructor(props: NotificationProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get heading(): string {
    return this.props.heading;
  }

  set heading(heading: string) {
    this.props.heading = heading;
  }

  get body(): string {
    return this.props.body;
  }

  set body(body: string) {
    this.props.body = body;
  }

  get scheduledSendAt(): Date {
    return this.props.scheduledSendAt;
  }

  set scheduledSendAt(scheduledSendAt: Date) {
    this.props.scheduledSendAt = scheduledSendAt;
  }

  get authorId(): number {
    return this.props.authorId;
  }

  set authorId(authorId: number) {
    this.props.authorId = authorId;
  }
}