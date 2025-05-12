import { BaseEntity } from '@utils/entity';
import { IncidentInfoType } from '@prisma/client';

export interface IncidentInfoProps {
  id?: number;
  type: IncidentInfoType;
  name: string;
}

export class IncidentInfo extends BaseEntity<IncidentInfoProps> {
  constructor(props: IncidentInfoProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get type(): IncidentInfoType {
    return this.props.type;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }
}
