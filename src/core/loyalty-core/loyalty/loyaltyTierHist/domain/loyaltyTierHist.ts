import { BaseEntity } from '@utils/entity';

export interface LoyaltyTierHistProps {
  id?: number;
  cardId: number;
  transitionDate: Date;
  oldCardTierId: number;
  newCardTierId: number;
}

export class LoyaltyTierHist extends BaseEntity<LoyaltyTierHistProps> {
  constructor(props: LoyaltyTierHistProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get cardId(): number {
    return this.props.cardId;
  }

  set cardId(cardId: number) {
    this.props.cardId = cardId;
  }

  get transitionDate(): Date {
    return this.props.transitionDate;
  }

  set transitionDate(transitionDate: Date) {
    this.props.transitionDate = transitionDate;
  }

  get oldCardTierId(): number {
    return this.props.oldCardTierId;
  }

  set oldCardTierId(oldCardTierId: number) {
    this.props.oldCardTierId = oldCardTierId;
  }

  get newCardTierId(): number {
    return this.props.newCardTierId;
  }

  set newCardTierId(newCardTierId: number) {
    this.props.newCardTierId = newCardTierId;
  }
}
