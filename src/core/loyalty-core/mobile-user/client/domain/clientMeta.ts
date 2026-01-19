import { BaseEntity } from '@utils/entity';

export interface ClientMetaProps {
  id?: number;
  clientId: number;
  deviceId: string;
  model: string;
  name: string;
  platform: string;
}

export class ClientMeta extends BaseEntity<ClientMetaProps> {
  constructor(props: ClientMetaProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get clientId(): number {
    return this.props.clientId;
  }

  get deviceId(): string {
    return this.props.deviceId;
  }

  get model(): string {
    return this.props.model;
  }

  get name(): string {
    return this.props.name;
  }

  get platform(): string {
    return this.props.platform;
  }

  set deviceId(deviceId: string) {
    this.props.deviceId = deviceId;
  }

  set model(model: string) {
    this.props.model = model;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set platform(platform: string) {
    this.props.platform = platform;
  }
}
