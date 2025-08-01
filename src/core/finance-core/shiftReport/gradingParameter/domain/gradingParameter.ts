import { BaseEntity } from "@utils/entity";

export interface GradingParameterProps {
  id?: number;
  name: string;
  description?: string;
  weightPercent: number;
}

export class GradingParameter extends BaseEntity<GradingParameterProps> {
  constructor(props: GradingParameterProps) {
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
  get description(): string {
    return this.props.description;
  }
  set description(description: string) {
    this.props.description = description;
  }
  get weightPercent(): number {
    return this.props.weightPercent;
  }
  set weightPercent(weightPercent: number) {
    this.props.weightPercent = weightPercent;
  }
}