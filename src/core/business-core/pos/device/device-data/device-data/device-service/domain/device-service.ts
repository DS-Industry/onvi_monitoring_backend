import { BaseEntity } from '@utils/entity';

export interface DeviceServiceProps {
  id?: number;
  carWashDeviceId: number;
  carWashDeviceProgramsTypeId: number;
  beginDate: Date;
  endDate: Date;
  loadDate: Date;
  localId: number;
  counter: string;
  errNumId?: number;
}

export class DeviceService extends BaseEntity<DeviceServiceProps> {
  constructor(props: DeviceServiceProps) {
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

  get endDate(): Date {
    return this.props.endDate;
  }

  get loadDate(): Date {
    return this.props.loadDate;
  }

  get counter(): string {
    return this.props.counter;
  }

  get localId(): number {
    return this.props.localId;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }
}
