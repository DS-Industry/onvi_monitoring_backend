import { BaseEntity } from '@utils/entity';
import { LoyaltyDomainException } from '@exception/option.exceptions';
import { LOYALTY_DEBITING_BALANCE_EXCEPTION_CODE } from '@constant/error.constants';

export interface CardProps {
  id?: number;
  balance: number;
  mobileUserId: number;
  devNumber: number;
  number: number;
  monthlyLimit?: number;
  loyaltyCardTierId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card extends BaseEntity<CardProps> {
  constructor(props: CardProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get balance(): number {
    return this.props.balance;
  }

  get mobileUserId(): number {
    return this.props.mobileUserId;
  }

  get devNumber(): number {
    return this.props.devNumber;
  }

  get number(): number {
    return this.props.number;
  }

  get monthlyLimit(): number {
    return this.props.monthlyLimit;
  }

  get loyaltyCardTierId(): number {
    return this.props.loyaltyCardTierId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set balance(balance: number) {
    this.props.balance = balance;
  }

  set monthlyLimit(monthlyLimit: number) {
    this.props.monthlyLimit = monthlyLimit;
  }

  set loyaltyCardTierId(loyaltyCardTierId: number) {
    this.props.loyaltyCardTierId = loyaltyCardTierId;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  adjustSum(sum: number): void {
    const newBalance = this.balance + sum;
    if (newBalance < 0) {
      throw new LoyaltyDomainException(
        LOYALTY_DEBITING_BALANCE_EXCEPTION_CODE,
        'Card debiting balance error',
      );
    }
    this.balance = newBalance;
  }
}
