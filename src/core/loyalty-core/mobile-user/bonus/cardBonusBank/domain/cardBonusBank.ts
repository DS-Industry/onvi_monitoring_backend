import { BaseEntity } from '@utils/entity';

export interface CardBonusBankProps {
  id?: number;
  cardMobileUserId: number;
  sum: number;
  accrualAt: Date;
  expiryAt: Date;
}

export class CardBonusBank extends BaseEntity<CardBonusBankProps> {
  constructor(props: CardBonusBankProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get cardMobileUserId(): number {
    return this.props.cardMobileUserId;
  }

  get sum(): number {
    return this.props.sum;
  }

  get accrualAt(): Date {
    return this.props.accrualAt;
  }

  get expiryAt(): Date {
    return this.props.expiryAt;
  }
}
