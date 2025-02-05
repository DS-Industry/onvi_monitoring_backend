import { BaseEntity } from '@utils/entity';

export interface CashCollectionDeviceProps {
  id?: number;
  cashCollectionId?: number;
  carWashDeviceId?: number;
  tookMoneyTime: Date;
  sum: number;
  sumCoin: number;
  sumPaper: number;
  virtualSum: number;
}

export class CashCollectionDevice extends BaseEntity<CashCollectionDeviceProps> {
  constructor(props: CashCollectionDeviceProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get cashCollectionId(): number {
    return this.props.cashCollectionId;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get tookMoneyTime(): Date {
    return this.props.tookMoneyTime;
  }

  get sum(): number {
    return this.props.sum;
  }

  get sumCoin(): number {
    return this.props.sumCoin;
  }

  get sumPaper(): number {
    return this.props.sumPaper;
  }

  get virtualSum(): number {
    return this.props.virtualSum;
  }

  set cashCollectionId(cashCollectionId: number) {
    this.props.cashCollectionId = cashCollectionId;
  }

  set carWashDeviceId(carWashDeviceId: number) {
    this.props.carWashDeviceId = carWashDeviceId;
  }

  set tookMoneyTime(tookMoneyTime: Date) {
    this.props.tookMoneyTime = tookMoneyTime;
  }

  set sum(sum: number) {
    this.props.sum = sum;
  }

  set sumCoin(sumCoin: number) {
    this.props.sumCoin = sumCoin;
  }

  set sumPaper(sumPaper: number) {
    this.props.sumPaper = sumPaper;
  }

  set virtualSum(virtualSum: number) {
    this.props.virtualSum = virtualSum;
  }
}
