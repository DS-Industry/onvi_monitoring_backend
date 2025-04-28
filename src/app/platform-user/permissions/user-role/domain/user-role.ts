import { BaseEntity } from '@utils/entity';

export interface RoleProps {
  id?: number;
  name: string;
  description?: string;
}

export class UserRole extends BaseEntity<RoleProps> {
  constructor(props: RoleProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }

  get description(): string {
    return this.props.description;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }
}
