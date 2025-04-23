import { BaseEntity } from '@utils/entity';

export interface IncidentNameProps {
  id?: number;
  name: string;
}

export class IncidentName extends BaseEntity<IncidentNameProps> {
  constructor(props: IncidentNameProps) {
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
}
