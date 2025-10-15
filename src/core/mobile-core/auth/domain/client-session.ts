import { BaseEntity } from '@utils/entity';

export interface ClientSessionProps {
  id?: number;
  clientId: number;
  phone: string;
  refreshToken?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ClientSession extends BaseEntity<ClientSessionProps> {
  constructor(props: ClientSessionProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get clientId(): number {
    return this.props.clientId;
  }

  get phone(): string {
    return this.props.phone;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastLoginAt(): Date {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  setRefreshToken(token: string): void {
    this.props.refreshToken = token;
    this.props.lastLoginAt = new Date();
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.refreshToken = null;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
