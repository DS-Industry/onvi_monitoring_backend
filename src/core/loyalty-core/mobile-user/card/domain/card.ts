import { BaseEntity } from '@utils/entity';

export interface CardProps {
  id?: number;
  balance: number;
  mobileUserId: number;
  devNumber: number;
  number: number;
  monthlyLimit?: number;
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

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
