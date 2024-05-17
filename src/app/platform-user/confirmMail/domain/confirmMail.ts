import { BaseEntity } from '@utils/entity';

export interface ConfirmMailProps {
  id?: number;
  email: string;
  confirmString: string;
  createDate?: Date;
  expireDate?: Date;
}

export class ConfirmMail extends BaseEntity<ConfirmMailProps> {
  constructor(props: ConfirmMailProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get confirmString(): string {
    return this.props.confirmString;
  }

  get createDate(): Date {
    return this.props.createDate;
  }

  get expireDate(): Date {
    return this.props.expireDate;
  }

  set confirmString(confirmString: string) {
    this.props.confirmString = confirmString;
  }

  set createDate(createDate: Date) {
    this.props.createDate = createDate;
  }

  set expireDate(expireDate: Date) {
    this.props.expireDate = expireDate;
  }
}
