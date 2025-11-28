import { WarehouseDocumentStatus, WarehouseDocumentType } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface WarehouseDocumentProps {
  id?: number;
  name: string;
  type: WarehouseDocumentType;
  warehouseId?: number;
  warehouseName?: string;
  responsibleId?: number;
  responsibleName?: string;
  status: WarehouseDocumentStatus;
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

  get status(): WarehouseDocumentStatus {
    return this.props.status;
  }

  get responsibleId(): number {
    return this.props.responsibleId;
  }

  get responsibleName(): string {
    return this.props.responsibleName;
  }

  get warehouseId(): number {
    return this.props.warehouseId;
  }

  get warehouseName(): string {
    return this.props.warehouseName;
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

  set status(status: WarehouseDocumentStatus) {
    this.props.status = status;
  }

  set warehouseId(warehouseId: number) {
    this.props.warehouseId = warehouseId;
  }

  set warehouseName(warehouseName: string) {
    this.props.warehouseName = warehouseName;
  }

  set responsibleId(responsibleId: number) {
    this.props.responsibleId = responsibleId;
  }

  set responsibleName(responsibleName: string) {
    this.props.responsibleName = responsibleName;
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
