import { BaseEntity } from '@utils/entity';

export interface BenefitActionProps {
  id?: number;
  name: string;
  description?: string;
}

export class BenefitAction extends BaseEntity<BenefitActionProps> {
  constructor(props: BenefitActionProps) {
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

  set description(description: string) {
    this.props.description = description;
  }
}
