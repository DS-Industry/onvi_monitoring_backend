import { BaseEntity } from '@utils/entity';

export interface InventoryItemProps {
  id?: number;
  nomenclatureId: number;
  quantity: number;
  warehouseId: number;
}

export class InventoryItem extends BaseEntity<InventoryItemProps> {
  constructor(props: InventoryItemProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get nomenclatureId(): number {
    return this.props.nomenclatureId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get warehouseId(): number {
    return this.props.warehouseId;
  }

  set nomenclatureId(nomenclatureId: number) {
    this.props.nomenclatureId = nomenclatureId;
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
  }

  set warehouseId(warehouseId: number) {
    this.props.warehouseId = warehouseId;
  }

  adjustQuantity(amount: number): void {
    const newQuantity = this.quantity + amount;
    if (newQuantity < 0) {
      throw new Error('stock value error');
    }
    this.quantity = newQuantity;
  }
}
