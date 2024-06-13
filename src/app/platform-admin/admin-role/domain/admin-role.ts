import { BaseEntity } from '@utils/entity';

export interface RoleProps {
  id?: number;
  name: string;
}

export class AdminRole extends BaseEntity<RoleProps> {
  constructor(props: RoleProps) {
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
