import { BaseEntity } from '@utils/entity';

export interface DeviceProgramTypeProps {
  id?: number;
  carWashDeviceTypeId: number;
  name: string;
  code?: string;
  description?: string;
  orderNum?: number;
}

export class DeviceProgramType extends BaseEntity<DeviceProgramTypeProps> {
  constructor(props: DeviceProgramTypeProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashDeviceTypeId(): number {
    return this.props.carWashDeviceTypeId;
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string {
    return this.props.description;
  }

  get orderNum(): number {
    return this.props.orderNum;
  }

  set carWashDeviceTypeId(carWashDeviceTypeId: number) {
    this.props.carWashDeviceTypeId = carWashDeviceTypeId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set code(code: string) {
    this.props.code = code;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set orderNum(orderNum: number) {
    this.props.orderNum = orderNum;
  }
}
