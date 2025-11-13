import { BaseEntity } from '@utils/entity';

export interface WarehouseProps {
  id?: number;
  name: string;
  location: string;
  managerId: number;
  managerName?: string;
  posId: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class Warehouse extends BaseEntity<WarehouseProps> {
  constructor(props: WarehouseProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get location(): string {
    return this.props.location;
  }

  get managerId(): number {
    return this.props.managerId;
  }

  get managerName(): string {
    return this.props.managerName;
  }

  get posId(): number {
    return this.props.posId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set location(location: string) {
    this.props.location = location;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  set managerId(managerId: number) {
    this.props.managerId = managerId;
  }

  set managerName(managerName: string) {
    this.props.managerName = managerName;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
