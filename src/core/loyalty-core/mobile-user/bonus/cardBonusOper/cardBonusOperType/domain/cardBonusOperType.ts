import { SignOperType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface CardBonusOperTypeProps {
  id?: number;
  name: string;
  signOper: SignOperType;
}

export class CardBonusOperType extends BaseEntity<CardBonusOperTypeProps> {
  constructor(props: CardBonusOperTypeProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get signOper(): SignOperType {
    return this.props.signOper;
  }
}
