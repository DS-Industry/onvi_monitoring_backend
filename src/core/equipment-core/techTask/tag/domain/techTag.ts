import { BaseEntity } from '@utils/entity';

export interface TechTagProps {
  id?: number;
  name: string;
  code?: string;
}

export class TechTag extends BaseEntity<TechTagProps> {
  constructor(props: TechTagProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set code(code: string) {
    this.props.code = code;
  }
}
