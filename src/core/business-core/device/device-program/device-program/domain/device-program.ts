import { Prisma } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface DeviceProgramProps {
  id?: number;
  carWashDeviceId?: number;
  carWashDeviceProgramsTypeId?: number;
  beginDate: Date;
  loadDate: Date;
  endDate: Date;
  confirm: number;
  isPaid: number;
  localId: number;
  isAgregate?: number;
  minute?: Prisma.Decimal;
  errNumId?: number;
}

export class DeviceProgram extends BaseEntity<DeviceProgramProps> {
  constructor(props: DeviceProgramProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get carWashDeviceProgramsTypeId(): number {
    return this.props.carWashDeviceProgramsTypeId;
  }

  get beginDate(): Date {
    return this.props.beginDate;
  }

  get loadDate(): Date {
    return this.props.loadDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get confirm(): number {
    return this.props.confirm;
  }

  get isPaid(): number {
    return this.props.isPaid;
  }

  get localId(): number {
    return this.props.localId;
  }

  get isAgregate(): number {
    return this.props.isAgregate;
  }

  get minute(): Prisma.Decimal {
    return this.props.minute;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }
}
