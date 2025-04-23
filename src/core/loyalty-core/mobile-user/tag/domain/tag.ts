import { BaseEntity } from '@utils/entity';

export interface TagProps {
  id?: number;
  name: string;
  color: string;
}

export class Tag extends BaseEntity<TagProps> {
  constructor(props: TagProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set color(color: string) {
    this.props.color = color;
  }
}
