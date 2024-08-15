import { BaseEntity } from '@utils/entity';

export interface DeviceObjectProps {
  id?: number;
  name: string;
}

export class DeviceObject extends BaseEntity<DeviceObjectProps> {
  constructor(props: DeviceObjectProps) {
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
