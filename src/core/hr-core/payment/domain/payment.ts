import { BaseEntity } from "@utils/entity";
import { PaymentType } from "@prisma/client";

export interface PaymentProps {
  id?: number;
  hrWorkerId: number;
  paymentType: PaymentType;
  paymentDate: Date;
  billingMonth: Date;
  countShifts: number;
  sum: number;
  prize: number;
  fine: number;
  virtualSum?: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number
}

export class Payment extends BaseEntity<PaymentProps> {
  constructor(props: PaymentProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get paymentType(): PaymentType {
    return this.props.paymentType;
  }

  get hrWorkerId(): number {
    return this.props.hrWorkerId;
  }

  get paymentDate(): Date {
    return this.props.paymentDate;
  }

  set paymentDate(paymentDate: Date) {
    this.props.paymentDate = paymentDate;
  }

  get billingMonth(): Date {
    return this.props.billingMonth;
  }

  set billingMonth(billingMonth: Date) {
    this.props.billingMonth = billingMonth;
  }

  get countShifts(): number {
    return this.props.countShifts;
  }

  set countShifts(countShifts: number) {
    this.props.countShifts = countShifts;
  }

  get sum(): number {
    return this.props.sum;
  }

  set sum(sum: number) {
    this.props.sum = sum;
  }

  get prize(): number {
    return this.props.prize;
  }

  set prize(prize: number) {
    this.props.prize = prize;
  }

  get fine(): number {
    return this.props.fine;
  }

  set fine(fine: number) {
    this.props.fine = fine;
  }

  get virtualSum(): number {
    return this.props.virtualSum;
  }

  set virtualSum(virtualSum: number) {
    this.props.virtualSum = virtualSum;
  }

  get comment(): string {
    return this.props.comment;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }

}