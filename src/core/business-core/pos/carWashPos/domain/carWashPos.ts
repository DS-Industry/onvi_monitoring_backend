import { BaseEntity } from '@utils/entity';

export interface CarWashPosProps {
  id?: number;
  name: string;
  slug: string;
  posId: number;
}

export class CarWashPos extends BaseEntity<CarWashPosProps> {
  constructor(props: CarWashPosProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get posId(): number {
    return this.props.posId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set slug(slug: string) {
    this.props.slug = slug;
  }
}
