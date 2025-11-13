import { BaseEntity } from '@utils/entity';

export interface OtpTokenProps {
  phone: string;
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt?: Date;
}

export class OtpToken extends BaseEntity<OtpTokenProps> {
  constructor(props: OtpTokenProps) {
    super(props);
  }

  get phone(): string {
    return this.props.phone;
  }

  get code(): string {
    return this.props.code;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isUsed(): boolean {
    return this.props.isUsed;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  isValid(inputCode: string): boolean {
    return (
      !this.props.isUsed && !this.isExpired() && this.props.code === inputCode
    );
  }

  markAsUsed(): void {
    this.props.isUsed = true;
  }

  static create(
    phone: string,
    code: string,
    expiryMinutes: number = 5,
  ): OtpToken {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    return new OtpToken({
      phone,
      code,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    });
  }
}
