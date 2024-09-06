import { BaseEntity } from '@utils/entity';

export interface DeviceEventTypeProps {
  id?: number;
  name: string;
}

export class DeviceEventType extends BaseEntity<DeviceEventTypeProps> {
  constructor(props: DeviceEventTypeProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }
}