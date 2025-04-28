import { StatusCashCollection } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface CashCollectionProps {
  id?: number;
  oldCashCollectionDate?: Date;
  cashCollectionDate: Date;
  sendDate?: Date;
  status: StatusCashCollection;
  sumFact?: number;
  posId?: number;
  shortage?: number;
  sumCard?: number;
  countCar?: number;
  averageCheck?: number;
  virtualSum?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class CashCollection extends BaseEntity<CashCollectionProps> {
  constructor(props: CashCollectionProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get oldCashCollectionDate(): Date {
    return this.props.oldCashCollectionDate;
  }

  get cashCollectionDate(): Date {
    return this.props.cashCollectionDate;
  }

  get sendDate(): Date {
    return this.props.sendDate;
  }

  get status(): StatusCashCollection {
    return this.props.status;
  }

  get sumFact(): number {
    return this.props.sumFact;
  }

  get posId(): number {
    return this.props.posId;
  }

  get shortage(): number {
    return this.props.shortage;
  }

  get sumCard(): number {
    return this.props.sumCard;
  }

  get countCar(): number {
    return this.props.countCar;
  }

  get averageCheck(): number {
    return this.props.averageCheck;
  }

  get virtualSum(): number {
    return this.props.virtualSum;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set oldCashCollectionDate(oldCashCollectionDate: Date) {
    this.props.oldCashCollectionDate = oldCashCollectionDate;
  }

  set cashCollectionDate(cashCollectionDate: Date) {
    this.props.cashCollectionDate = cashCollectionDate;
  }

  set sendDate(sendDate: Date) {
    this.props.sendDate = sendDate;
  }

  set status(status: StatusCashCollection) {
    this.props.status = status;
  }

  set sumFact(sumFact: number) {
    this.props.sumFact = sumFact;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  set shortage(shortage: number) {
    this.props.shortage = shortage;
  }

  set sumCard(sumCard: number) {
    this.props.sumCard = sumCard;
  }

  set countCar(countCar: number) {
    this.props.countCar = countCar;
  }

  set averageCheck(averageCheck: number) {
    this.props.averageCheck = averageCheck;
  }

  set virtualSum(virtualSum: number) {
    this.props.virtualSum = virtualSum;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
