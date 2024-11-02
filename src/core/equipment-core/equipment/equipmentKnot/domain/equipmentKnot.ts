import { BaseEntity } from '@utils/entity';

export interface EquipmentKnotProps {
  id?: number;
  name: string;
  posId: number;
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

  get posId(): number {
    return this.props.posId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }
}
