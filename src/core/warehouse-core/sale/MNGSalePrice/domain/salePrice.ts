import { BaseEntity } from '@utils/entity';

export interface SalePriceProps {
  id?: number;
  nomenclatureId: number;
  warehouseId: number;
  price: number;
}

export class SalePrice extends BaseEntity<SalePriceProps> {
  constructor(props: SalePriceProps) {
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

  get warehouseId(): number {
    return this.props.warehouseId;
  }

  set warehouseId(warehouseId: number) {
    this.props.warehouseId = warehouseId;
  }

  get price(): number {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
  }
}
