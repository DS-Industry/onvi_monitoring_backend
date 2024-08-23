import { BaseEntity } from '@utils/entity';

export interface DeviceApiKeyProps {
  id?: number;
  key: string;
  expiryAt: Date;
  issuedAt: Date;
  organizationId: number;
}

export class DeviceApiKey extends BaseEntity<DeviceApiKeyProps> {
  constructor(props: DeviceApiKeyProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get key(): string {
    return this.props.key;
  }

  get expiryAt(): Date {
    return this.props.expiryAt;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get organizationId(): number {
    return this.props.organizationId;
  }

  set key(key: string) {
    this.props.key = key;
  }

  set expiryAt(expiryAt: Date) {
    this.props.expiryAt = expiryAt;
  }

  set issuedAt(issuedAt: Date) {
    this.props.issuedAt = issuedAt;
  }

  set organizationId(organizationId: number) {
    this.props.organizationId = organizationId;
  }
}
