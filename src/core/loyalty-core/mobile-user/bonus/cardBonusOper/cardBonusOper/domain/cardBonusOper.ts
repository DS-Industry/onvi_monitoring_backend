import { BaseEntity } from '@utils/entity';

export interface CardBonusOperProps {
  id?: number;
  cardMobileUserId?: number;
  carWashDeviceId?: number;
  typeOperId: number;
  operDate: Date;
  loadDate: Date;
  sum: number;
  comment?: string;
  creatorId?: number;
  orderMobileUserId?: number;
}

export class CardBonusOper extends BaseEntity<CardBonusOperProps> {
  constructor(props: CardBonusOperProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get cardMobileUserId(): number {
    return this.props.cardMobileUserId;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get typeOperId(): number {
    return this.props.typeOperId;
  }

  get operDate(): Date {
    return this.props.operDate;
  }

  get loadDate(): Date {
    return this.props.loadDate;
  }

  get sum(): number {
    return this.props.sum;
  }

  get comment(): string {
    return this.props.comment;
  }

  get creatorId(): number {
    return this.props.creatorId;
  }

  get orderMobileUserId(): number {
    return this.props.orderMobileUserId;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  set creatorId(creatorId: number) {
    this.props.creatorId = creatorId;
  }
}
