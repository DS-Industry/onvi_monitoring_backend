import { BaseEntity } from '@utils/entity';

export interface DeviceProgramChangeProps {
  id?: number;
  carWashPosId: number;
  carWashDeviceId: number;
  carWashDeviceProgramsTypeFromId: number;
  carWashDeviceProgramsTypeToId: number;
}

export class DeviceProgramChange extends BaseEntity<DeviceProgramChangeProps> {
  constructor(props: DeviceProgramChangeProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get carWashPosId(): number {
    return this.props.carWashPosId;
  }

  get carWashDeviceId(): number {
    return this.props.carWashDeviceId;
  }

  get carWashDeviceProgramsTypeFromId(): number {
    return this.props.carWashDeviceProgramsTypeFromId;
  }

  get carWashDeviceProgramsTypeToId(): number {
    return this.props.carWashDeviceProgramsTypeToId;
  }

  set carWashPosId(carWashPosId: number) {
    this.props.carWashPosId = carWashPosId;
  }

  set carWashDeviceId(carWashDeviceId: number) {
    this.props.carWashDeviceId = carWashDeviceId;
  }

  set carWashDeviceProgramsTypeFromId(carWashDeviceProgramsTypeFromId: number) {
    this.props.carWashDeviceProgramsTypeFromId =
      carWashDeviceProgramsTypeFromId;
  }

  set carWashDeviceProgramsTypeToId(carWashDeviceProgramsTypeToId: number) {
    this.props.carWashDeviceProgramsTypeToId = carWashDeviceProgramsTypeToId;
  }
}
