import {
  InventoryMetaDataType,
  MovingMetaDataType,
} from '@warehouse/document/documentDetail/interface/warehouseDocumentType';
import { BaseEntity } from '@utils/entity';

export interface WarehouseDocumentDetailProps {
  id?: number;
  warehouseDocumentId: number;
  nomenclatureId: number;
  quantity: number;
  comment?: string;
  metaData?: InventoryMetaDataType | MovingMetaDataType;
}

export class WarehouseDocumentDetail extends BaseEntity<WarehouseDocumentDetailProps> {
  constructor(props: WarehouseDocumentDetailProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get warehouseDocumentId(): number {
    return this.props.warehouseDocumentId;
  }

  get nomenclatureId(): number {
    return this.props.nomenclatureId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get comment(): string {
    return this.props.comment;
  }

  get metaData(): InventoryMetaDataType | MovingMetaDataType {
    return this.props.metaData;
  }

  set warehouseDocumentId(warehouseDocumentId: number) {
    this.props.warehouseDocumentId = warehouseDocumentId;
  }

  set nomenclatureId(nomenclatureId: number) {
    this.props.nomenclatureId = nomenclatureId;
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  set metaData(metaData: InventoryMetaDataType | MovingMetaDataType) {
    this.props.metaData = metaData;
  }
}
