import { StatusDeviceDataRaw } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface DeviceDataRawProps {
  id?: number;
  data: string;
  errors?: string;
  status?: StatusDeviceDataRaw;
  version: string;
  createdAt?: Date;
  updatedAt?: Date;
  countRow?: number;
  countError?: number;
}

export class DeviceDataRaw extends BaseEntity<DeviceDataRawProps> {
  constructor(props: DeviceDataRawProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get data(): string {
    return this.props.data;
  }

  get errors(): string {
    return this.props.errors;
  }

  get status(): StatusDeviceDataRaw {
    return this.props.status;
  }

  get version(): string {
    return this.props.version;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get countRow(): number {
    return this.props.countRow;
  }

  get countError(): number {
    return this.props.countError;
  }

  set errors(errors: string) {
    this.props.errors = errors;
  }

  set status(status: StatusDeviceDataRaw) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set countRow(countRow: number) {
    this.props.countRow = countRow;
  }

  set countError(countError: number) {
    this.props.countError = countError;
  }
}
