import { WarehouseDocumentType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface WarehouseDocumentProps {
  id?: number;
  name: string;
  type: WarehouseDocumentType;
  warehouseId: number;
  responsibleId: number;
  carryingAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class WarehouseDocument extends BaseEntity<WarehouseDocumentProps> {
  constructor(props: WarehouseDocumentProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): WarehouseDocumentType {
    return this.props.type;
  }

  get responsibleId(): number {
    return this.props.responsibleId;
  }

  get warehouseId(): number {
    return this.props.warehouseId;
  }

  get carryingAt(): Date {
    return this.props.carryingAt;
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

  set type(type: WarehouseDocumentType) {
    this.props.type = type;
  }

  set warehouseId(warehouseId: number) {
    this.props.warehouseId = warehouseId;
  }

  set responsibleId(responsibleId: number) {
    this.props.responsibleId = responsibleId;
  }

  set carryingAt(carryingAt: Date) {
    this.props.carryingAt = carryingAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
