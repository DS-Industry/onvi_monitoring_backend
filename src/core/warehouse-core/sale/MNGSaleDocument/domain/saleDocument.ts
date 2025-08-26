import { BaseEntity } from '@utils/entity';

export interface SaleDocumentProps {
  id?: number;
  name: string;
  warehouseId: number;
  responsibleManagerId: number;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}

export class SaleDocument extends BaseEntity<SaleDocumentProps> {
  constructor(props: SaleDocumentProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get warehouseId(): number {
    return this.props.warehouseId;
  }

  set warehouseId(warehouseId: number) {
    this.props.warehouseId = warehouseId;
  }

  get responsibleManagerId(): number {
    return this.props.responsibleManagerId;
  }

  set responsibleManagerId(responsibleManagerId: number) {
    this.props.responsibleManagerId = responsibleManagerId;
  }

  get saleDate(): Date {
    return this.props.saleDate;
  }

  set saleDate(saleDate: Date) {
    this.props.saleDate = saleDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  set createdById(createdById: number) {
    this.props.createdById = createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
