import { BaseEntity } from '@utils/entity';

export interface TechTaskItemValueToTechTaskProps {
  id?: number;
  techTaskId: number;
  techTaskItemTemplateId: number;
  value?: string;
}

export class TechTaskItemValueToTechTask extends BaseEntity<TechTaskItemValueToTechTaskProps> {
  constructor(props: TechTaskItemValueToTechTaskProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get techTaskId(): number {
    return this.props.techTaskId;
  }

  get techTaskItemTemplateId(): number {
    return this.props.techTaskItemTemplateId;
  }

  get value(): string {
    return this.props.value;
  }

  set value(value: string) {
    this.props.value = value;
  }
}
