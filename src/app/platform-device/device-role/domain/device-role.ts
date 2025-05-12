import { BaseEntity } from '@utils/entity';

export interface DeviceRoleProps {
  id?: number;
  name: string;
}

export class DeviceRole extends BaseEntity<DeviceRoleProps> {
  constructor(props: DeviceRoleProps) {
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
