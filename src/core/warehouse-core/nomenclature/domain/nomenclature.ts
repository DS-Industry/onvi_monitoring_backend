import { BaseEntity } from '@utils/entity';
import {
  DestinyNomenclature,
  MeasurementNomenclature,
  NomenclatureStatus,
} from '@prisma/client';
import { NomenclatureMeta } from '@warehouse/nomenclature/interface/nomenclatureMeta';

export interface NomenclatureProps {
  id?: number;
  name: string;
  sku: string;
  organizationId: number;
  categoryId: number;
  supplierId?: number;
  measurement: MeasurementNomenclature;
  destiny?: DestinyNomenclature;
  image?: string;
  status: NomenclatureStatus;
  metaData?: NomenclatureMeta;
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

  get destiny(): DestinyNomenclature {
    return this.props.destiny;
  }

  get image(): string {
    return this.props.image;
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

  get status(): NomenclatureStatus {
    return this.props.status;
  }

  get metaData(): NomenclatureMeta {
    return this.props.metaData;
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

  set destiny(destiny: DestinyNomenclature) {
    this.props.destiny = destiny;
  }

  set image(image: string) {
    this.props.image = image;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }

  set status(status: NomenclatureStatus) {
    this.props.status = status;
  }

  set metaData(metaData: NomenclatureMeta) {
    this.props.metaData = metaData;
  }
}
