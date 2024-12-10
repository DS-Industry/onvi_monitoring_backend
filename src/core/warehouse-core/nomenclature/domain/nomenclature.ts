import { BaseEntity } from '@utils/entity';
import { MeasurementNomenclature } from '@prisma/client';

export interface NomenclatureProps {
  id?: number;
  name: string;
  sku: string;
  organizationId: number;
  categoryId: number;
  supplierId?: number;
  measurement: MeasurementNomenclature;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class Nomenclature extends BaseEntity<NomenclatureProps> {
  constructor(props: NomenclatureProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get sku(): string {
    return this.props.sku;
  }

  get organizationId(): number {
    return this.props.organizationId;
  }

  get categoryId(): number {
    return this.props.categoryId;
  }

  get supplierId(): number {
    return this.props.supplierId;
  }

  get measurement(): MeasurementNomenclature {
    return this.props.measurement;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set sku(sku: string) {
    this.props.sku = sku;
  }

  set organizationId(organizationId: number) {
    this.props.organizationId = organizationId;
  }

  set categoryId(categoryId: number) {
    this.props.categoryId = categoryId;
  }

  set supplierId(supplierId: number) {
    this.props.supplierId = supplierId;
  }

  set measurement(measurement: MeasurementNomenclature) {
    this.props.measurement = measurement;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
