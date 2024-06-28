import { BaseEntity } from '@utils/entity';

export interface ObjectProps {
  id?: number;
  name: string;
}

export class ObjectPermissions extends BaseEntity<ObjectProps> {
  constructor(props: ObjectProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }
}
