import { BaseEntity } from '@utils/entity';

export interface DeviceMfuProps {
  id?: number;
  carWashDeviceId: number;
  cashIn: number;
  coinOut: number;
  beginDate: Date;
  endDate: Date;
  loadDate: Date;
  localId: number;
  errNumId?: number;
}

export class DeviceMfy extends BaseEntity<DeviceMfuProps> {
  constructor(props: DeviceMfuProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get cashIn(): number {
    return this.props.cashIn;
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

  get coinOut(): number {
    return this.props.coinOut;
  }

  get localId(): number {
    return this.props.localId;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }
}
