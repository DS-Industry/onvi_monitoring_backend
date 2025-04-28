import { BaseEntity } from '@utils/entity';

export interface LoyaltyTierProps {
  id?: number;
  name: string;
  description?: string;
  loyaltyProgramId: number;
  limitBenefit: number;
}

export class LoyaltyTier extends BaseEntity<LoyaltyTierProps> {
  constructor(props: LoyaltyTierProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get loyaltyProgramId(): number {
    return this.props.loyaltyProgramId;
  }

  get limitBenefit(): number {
    return this.props.limitBenefit;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set loyaltyProgramId(loyaltyProgramId: number) {
    this.props.loyaltyProgramId = loyaltyProgramId;
  }

  set limitBenefit(limitBenefit: number) {
    this.props.limitBenefit = limitBenefit;
  }
}
