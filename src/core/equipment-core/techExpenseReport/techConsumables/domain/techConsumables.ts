import { TechConsumablesType } from "@prisma/client";
import { BaseEntity } from "@utils/entity";

export interface TechConsumablesProps {
  id?: number;
  nomenclatureId: number;
  posId: number;
  type: TechConsumablesType;
}

export class TechConsumables extends BaseEntity<TechConsumablesProps> {
  constructor(props: TechConsumablesProps) {
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

  get posId(): number {
    return this.props.posId;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  get type(): TechConsumablesType {
    return this.props.type;
  }

  set type(type: TechConsumablesType) {
    this.props.type = type;
  }
}