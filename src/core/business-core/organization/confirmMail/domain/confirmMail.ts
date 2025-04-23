import { BaseEntity } from '@utils/entity';
import { PositionUser, StatusDeviceDataRaw } from '@prisma/client';

export interface OrganizationConfirmMailProps {
  id?: number;
  email: string;
  organizationId: number;
  roleId: number;
  confirmString: string;
  name: string;
  surname?: string;
  middlename?: string;
  phone: string;
  birthday: Date;
  position: PositionUser;
  status: StatusDeviceDataRaw;
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

  get roleId(): number {
    return this.props.roleId;
  }

  get email(): string {
    return this.props.email;
  }

  get confirmString(): string {
    return this.props.confirmString;
  }

  get name(): string {
    return this.props.name;
  }

  get surname(): string {
    return this.props.surname;
  }

  get middlename(): string {
    return this.props.middlename;
  }

  get phone(): string {
    return this.props.phone;
  }

  get birthday(): Date {
    return this.props.birthday;
  }

  get position(): PositionUser {
    return this.props.position;
  }

  get status(): StatusDeviceDataRaw {
    return this.props.status;
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

  set status(status: StatusDeviceDataRaw) {
    this.props.status = status;
  }

  set createDate(createDate: Date) {
    this.props.createDate = createDate;
  }

  set expireDate(expireDate: Date) {
    this.props.expireDate = expireDate;
  }
}
