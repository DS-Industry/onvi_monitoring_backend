import { BaseEntity } from '@utils/entity';
import { CurrencyType } from "@prisma/client";

export interface DeviceOperationProps {
  id?: number;
  carWashDeviceId: number;
  operDate: Date;
  loadDate: Date;
  counter: string;
  operSum: number;
  confirm: number;
  isAgregate: number;
  localId: number;
  currencyId: number;
  isBoxOffice: number;
  errNumId?: number;
  currencyType?: CurrencyType;
  currencyName?: string;
}

export class DeviceOperation extends BaseEntity<DeviceOperationProps> {
  constructor(props: DeviceOperationProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get operDate(): Date {
    return this.props.operDate;
  }

  get loadDate(): Date {
    return this.props.loadDate;
  }

  get counter(): string {
    return this.props.counter;
  }

  get operSum(): number {
    return this.props.operSum;
  }

  get confirm(): number {
    return this.props.confirm;
  }

  get isAgregate(): number {
    return this.props.isAgregate;
  }

  get localId(): number {
    return this.props.localId;
  }

  get currencyId(): number {
    return this.props.currencyId;
  }

  get isBoxOffice(): number {
    return this.props.isBoxOffice;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }

  get currencyType(): CurrencyType {
    return this.props.currencyType;
  }

  get currencyName(): string {
    return this.props.currencyName;
  }
}
