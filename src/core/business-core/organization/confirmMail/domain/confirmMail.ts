import { BaseEntity } from '@utils/entity';

export interface OrganizationConfirmMailProps {
  id?: number;
  email: string;
  organizationId: number;
  confirmString: string;
  createDate?: Date;
  expireDate?: Date;
}

export class OrganizationConfirmMail extends BaseEntity<OrganizationConfirmMailProps> {
  constructor(props: OrganizationConfirmMailProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get organizationId(): number {
    return this.props.organizationId;
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
