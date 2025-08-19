import { BaseEntity } from '@utils/entity';

export interface SaleItemProps {
  id?: number;
  nomenclatureId: number;
  mngSaleDocumentId: number;
  count: number;
}

export class SaleItem extends BaseEntity<SaleItemProps> {
  constructor(props: SaleItemProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get nomenclatureId(): number {
    return this.props.nomenclatureId;
  }

  set nomenclatureId(nomenclatureId: number) {
    this.props.nomenclatureId = nomenclatureId;
  }

  get mngSaleDocumentId(): number {
    return this.props.mngSaleDocumentId;
  }

  set mngSaleDocumentId(mngSaleDocumentId: number) {
    this.props.mngSaleDocumentId = mngSaleDocumentId;
  }

  get count(): number {
    return this.props.count;
  }

  set count(count: number) {
    this.props.count = count;
  }
}
