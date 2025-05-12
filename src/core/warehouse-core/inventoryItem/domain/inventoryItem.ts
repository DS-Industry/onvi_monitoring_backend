import { BaseEntity } from '@utils/entity';
import { WarehouseDomainException } from '@exception/option.exceptions';
import { WAREHOUSE_REMAINING_ITEM_EXCEPTION_CODE } from '@constant/error.constants';

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
      throw new WarehouseDomainException(
        WAREHOUSE_REMAINING_ITEM_EXCEPTION_CODE,
        'Inventory item movement error',
      );
    }
    this.quantity = newQuantity;
  }
}
