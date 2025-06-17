import { BaseEntity } from '@utils/entity';

export interface EquipmentKnotProps {
  id?: number;
  name: string;
}

export class EquipmentKnot extends BaseEntity<EquipmentKnotProps> {
  constructor(props: EquipmentKnotProps) {
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
