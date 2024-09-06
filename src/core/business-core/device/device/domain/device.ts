import { BaseEntity } from '@utils/entity';

export interface CarWashDeviceProps {
  id?: number;
  name: string;
  carWashDeviceMetaData: string;
  status: string;
  ipAddress: string;
  carWashDeviceTypeId: number;
  carWashPosId: number;
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

  get carWashDeviceMetaData(): string {
    return this.props.carWashDeviceMetaData;
  }

  get status(): string {
    return this.props.status;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  get carWashDeviceTypeId(): number {
    return this.props.carWashDeviceTypeId;
  }

  get carWashPosId(): number {
    return this.props.carWashPosId;
  }

  get deviceRoleId(): number | undefined {
    return this.props.deviceRoleId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set carWashDeviceMetaData(carWashDeviceMetaData: string) {
    this.props.carWashDeviceMetaData = carWashDeviceMetaData;
  }

  set status(status: string) {
    this.props.status = status;
  }

  set ipAddress(ipAddress: string) {
    this.props.ipAddress = ipAddress;
  }

  set carWashDeviceTypeId(carWashDeviceTypeId: number) {
    this.props.carWashDeviceTypeId = carWashDeviceTypeId;
  }

  set carWashPosId(carWashPosId: number) {
    this.props.carWashPosId = carWashPosId;
  }

  set deviceRoleId(roleId: number | undefined) {
    this.props.deviceRoleId = roleId;
  }
}
