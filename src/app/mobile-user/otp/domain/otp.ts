import { BaseEntity } from '@utils/entity';

export interface OtpProps {
  id?: number;
  phone: string;
  confirmCode: string;
  createDate?: Date;
  expireDate?: Date;
}

export class Otp extends BaseEntity<OtpProps> {
  constructor(props: OtpProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get phone(): string {
    return this.props.phone;
  }

  get confirmCode(): string {
    return this.props.confirmCode;
  }

  get createDate(): Date {
    return this.props.createDate;
  }

  get expireDate(): Date {
    return this.props.expireDate;
  }

  set confirmCode(confirmCode: string) {
    this.props.confirmCode = confirmCode;
  }

  set createDate(createDate: Date) {
    this.props.createDate = createDate;
  }

  set expireDate(expireDate: Date) {
    this.props.expireDate = expireDate;
  }
}
