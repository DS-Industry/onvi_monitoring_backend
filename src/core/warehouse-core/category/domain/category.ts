import { BaseEntity } from '@utils/entity';

export interface CategoryProps {
  id?: number;
  name: string;
  description?: string;
  ownerCategoryId?: number;
}

export class Category extends BaseEntity<CategoryProps> {
  constructor(props: CategoryProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get ownerCategoryId(): number {
    return this.props.ownerCategoryId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set ownerCategoryId(ownerCategoryId: number) {
    this.props.ownerCategoryId = ownerCategoryId;
  }
}
