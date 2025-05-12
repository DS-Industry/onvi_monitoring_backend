import { BaseEntity } from '@utils/entity';

export interface PositionProps {
  id?: number;
  name: string;
  organizationId: number;
  description?: string;
}

export class Position extends BaseEntity<PositionProps> {
  constructor(props: PositionProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get organizationId(): number {
    return this.props.organizationId;
  }

  get description(): string {
    return this.props.description;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }
}
