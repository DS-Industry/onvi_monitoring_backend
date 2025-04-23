import { BaseEntity } from '@utils/entity';
import { BenefitType } from '@prisma/client';

export interface BenefitProps {
  id?: number;
  name: string;
  bonus: number;
  benefitType: BenefitType;
  benefitActionTypeId?: number;
}

export class Benefit extends BaseEntity<BenefitProps> {
  constructor(props: BenefitProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get bonus(): number {
    return this.props.bonus;
  }

  get benefitType(): BenefitType {
    return this.props.benefitType;
  }

  get name(): string {
    return this.props.name;
  }

  get benefitActionTypeId(): number {
    return this.props.benefitActionTypeId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set benefitType(benefitType: BenefitType) {
    this.props.benefitType = benefitType;
  }

  set bonus(bonus: number) {
    this.props.bonus = bonus;
  }

  set benefitActionTypeId(benefitActionTypeId: number) {
    this.props.benefitActionTypeId = benefitActionTypeId;
  }
}
