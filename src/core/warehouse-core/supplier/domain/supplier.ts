import { BaseEntity } from '@utils/entity';

export interface SupplierProps {
  id?: number;
  name: string;
  contact: string;
}

export class Supplier extends BaseEntity<SupplierProps> {
  constructor(props: SupplierProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get contact(): string {
    return this.props.contact;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set contact(contact: string) {
    this.props.contact = contact;
  }
}
