import { BaseEntity } from '@utils/entity';

export interface CashCollectionDeviceTypeProps {
  id?: number;
  cashCollectionId?: number;
  carWashDeviceTypeId?: number;
  sumFact: number;
  sumCoin: number;
  sumPaper: number;
  virtualSum: number;
}

export class CashCollectionDeviceType extends BaseEntity<CashCollectionDeviceTypeProps> {
  constructor(props: CashCollectionDeviceTypeProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get cashCollectionId(): number {
    return this.props.cashCollectionId;
  }

  get carWashDeviceTypeId(): number {
    return this.props.carWashDeviceTypeId;
  }

  get sumFact(): number {
    return this.props.sumFact;
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

  set carWashDeviceTypeId(carWashDeviceTypeId: number) {
    this.props.carWashDeviceTypeId = carWashDeviceTypeId;
  }

  set sumFact(sumFact: number) {
    this.props.sumFact = sumFact;
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
