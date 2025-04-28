import { CurrencyType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface DeviceOperationCardProps {
  id?: number;
  carWashDeviceId: number;
  operDate: Date;
  loadDate: Date;
  cardNumber: string;
  discount: number;
  sum: number;
  localId: number;
  operId: number;
  discountSum: number;
  totalSum?: number;
  isBonus?: number;
  currency: CurrencyType;
  cashback?: number;
  cashbackPercent?: number;
  errNumId?: number;
}

export class DeviceOperationCard extends BaseEntity<DeviceOperationCardProps> {
  constructor(props: DeviceOperationCardProps) {
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

  get cardNumber(): string {
    return this.props.cardNumber;
  }

  get discount(): number {
    return this.props.discount;
  }

  get sum(): number {
    return this.props.sum;
  }

  get operId(): number {
    return this.props.operId;
  }

  get localId(): number {
    return this.props.localId;
  }

  get discountSum(): number {
    return this.props.discountSum;
  }

  get totalSum(): number {
    return this.props.totalSum;
  }

  get cashback(): number {
    return this.props.cashback;
  }

  get cashbackPercent(): number {
    return this.props.cashbackPercent;
  }

  get isBonus(): number {
    return this.props.isBonus;
  }

  get currency(): CurrencyType {
    return this.props.currency;
  }

  get errNumId(): number {
    return this.props.errNumId;
  }
}
