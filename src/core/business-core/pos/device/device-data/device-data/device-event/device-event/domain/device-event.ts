import { BaseEntity } from '@utils/entity';

export interface DeviceEventProps {
  id?: number;
  carWashDeviceId?: number;
  carWashDeviceEventTypeId?: number;
  eventDate: Date;
  loadDate: Date;
  localId: number;
  errNumId?: number;
}

export class DeviceEvent extends BaseEntity<DeviceEventProps> {
  constructor(props: DeviceEventProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get carWashDeviceEventTypeId(): number {
    return this.props.carWashDeviceEventTypeId;
  }

  get eventDate(): Date {
    return this.props.eventDate;
  }

  get loadDate(): Date {
    return this.props.loadDate;
  }
  get localId(): number {
    return this.props.localId;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }
}
