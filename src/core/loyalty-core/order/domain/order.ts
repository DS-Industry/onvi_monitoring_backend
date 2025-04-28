import {
  ExecutionStatus,
  OrderHandlerStatus,
  OrderStatus,
  PlatformType,
  SendAnswerStatus,
  UserType,
} from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface OrderProps {
  id?: number;
  transactionId: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  carWashDeviceId: number;
  platform: PlatformType;
  cardMobileUserId?: number;
  typeMobileUser: UserType;
  orderData: Date;
  createData: Date;
  orderStatus: OrderStatus;
  sendAnswerStatus?: SendAnswerStatus;
  sendTime?: Date;
  debitingMoney?: Date;
  executionStatus?: ExecutionStatus;
  reasonError?: string;
  executionError?: string;
  orderHandlerStatus?: OrderHandlerStatus;
  handlerError?: string;
}

export class Order extends BaseEntity<OrderProps> {
  constructor(props: OrderProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get transactionId(): string {
    return this.props.transactionId;
  }

  get sumFull(): number {
    return this.props.sumFull;
  }

  get sumReal(): number {
    return this.props.sumReal;
  }

  get sumBonus(): number {
    return this.props.sumBonus;
  }

  get sumDiscount(): number {
    return this.props.sumDiscount;
  }

  get sumCashback(): number {
    return this.props.sumCashback;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get platform(): PlatformType {
    return this.props.platform;
  }

  get cardMobileUserId(): number {
    return this.props.cardMobileUserId;
  }

  get typeMobileUser(): UserType {
    return this.props.typeMobileUser;
  }

  get orderData(): Date {
    return this.props.orderData;
  }

  get createData(): Date {
    return this.props.createData;
  }

  get orderStatus(): OrderStatus {
    return this.props.orderStatus;
  }

  get sendAnswerStatus(): SendAnswerStatus {
    return this.props.sendAnswerStatus;
  }

  get sendTime(): Date {
    return this.props.sendTime;
  }

  get debitingMoney(): Date {
    return this.props.debitingMoney;
  }

  get executionStatus(): ExecutionStatus {
    return this.props.executionStatus;
  }

  get reasonError(): string {
    return this.props.reasonError;
  }

  get executionError(): string {
    return this.props.executionError;
  }

  get orderHandlerStatus(): OrderHandlerStatus {
    return this.props.orderHandlerStatus;
  }

  get handlerError(): string {
    return this.props.handlerError;
  }

  set orderStatus(orderStatus: OrderStatus) {
    this.props.orderStatus = orderStatus;
  }

  set sendAnswerStatus(sendAnswerStatus: SendAnswerStatus) {
    this.props.sendAnswerStatus = sendAnswerStatus;
  }

  set sendTime(sendTime: Date) {
    this.props.sendTime = sendTime;
  }

  set executionStatus(executionStatus: ExecutionStatus) {
    this.props.executionStatus = executionStatus;
  }

  set reasonError(reasonError: string) {
    this.props.reasonError = reasonError;
  }

  set executionError(executionError: string) {
    this.props.executionError = executionError;
  }

  set orderHandlerStatus(orderHandlerStatus: OrderHandlerStatus) {
    this.props.orderHandlerStatus = orderHandlerStatus;
  }

  set handlerError(handlerError: string) {
    this.props.handlerError = handlerError;
  }
}
