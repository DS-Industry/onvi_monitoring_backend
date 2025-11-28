import { ManagerPaperTypeClass } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ManagerPaperTypeProps {
  id?: number;
  name: string;
  type: ManagerPaperTypeClass;
}

export class ManagerPaperType extends BaseEntity<ManagerPaperTypeProps> {
  constructor(props: ManagerPaperTypeProps) {
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

  get type(): ManagerPaperTypeClass {
    return this.props.type;
  }

  set type(type: ManagerPaperTypeClass) {
    this.props.type = type;
  }
}
