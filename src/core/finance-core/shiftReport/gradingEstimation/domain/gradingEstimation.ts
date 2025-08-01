import { BaseEntity } from '@utils/entity';

export interface GradingEstimationProps {
  id?: number;
  name: string;
  weightPercent: number;
}

export class GradingEstimation extends BaseEntity<GradingEstimationProps> {
  constructor(props: GradingEstimationProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }
  get weightPercent(): number {
    return this.props.weightPercent;
  }
  set weightPercent(weightPercent: number) {
    this.props.weightPercent = weightPercent;
  }
}
