import { BaseEntity } from '@utils/entity';

export interface CarWashDeviceProps {
  id?: number;
  name: string;
  carWashDeviceMetaData: string;
  status: string;
  ipAddress: string;
  carWashDeviceTypeId: number;
  deviceRoleId?: number;
}

export class CarWashDevice extends BaseEntity<CarWashDeviceProps> {
  constructor(props: CarWashDeviceProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get carWashDeviceMetaData(): string {
    return this.props.carWashDeviceMetaData;
  }

  set carWashDeviceMetaData(metaData: string) {
    this.props.carWashDeviceMetaData = metaData;
  }

  get status(): string {
    return this.props.status;
  }

  set status(status: string) {
    this.props.status = status;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  set ipAddress(ip: string) {
    this.props.ipAddress = ip;
  }

  get carWashDeviceTypeId(): number {
    return this.props.carWashDeviceTypeId;
  }

  set carWashDeviceTypeId(typeId: number) {
    this.props.carWashDeviceTypeId = typeId;
  }

  get deviceRoleId(): number | undefined {
    return this.props.deviceRoleId;
  }

  set deviceRoleId(roleId: number | undefined) {
    this.props.deviceRoleId = roleId;
  }
}
