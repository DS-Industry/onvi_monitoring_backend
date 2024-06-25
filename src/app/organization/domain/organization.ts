import { BaseEntity } from '@utils/entity';

export interface OrganizationProps {
  id?: number;
  name: string;
  slug: string;
  addressId: number;
  organizationDocuments: string;
  organizationStatus: string;
  organizationType: string;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId: number;
}

export class Organization extends BaseEntity<OrganizationProps> {
  constructor(props: OrganizationProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get addressId(): number {
    return this.props.addressId;
  }

  get organizationDocuments(): string {
    return this.props.organizationDocuments;
  }

  get organizationStatus(): string {
    return this.props.organizationStatus;
  }

  get organizationType(): string {
    return this.props.organizationType;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get ownerId(): number {
    return this.props.ownerId;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set slug(slug: string) {
    this.props.slug = slug;
  }

  set addressId(addressId: number) {
    this.props.addressId = addressId;
  }

  set organizationDocuments(organizationDocuments: string) {
    this.props.organizationDocuments = organizationDocuments;
  }

  set organizationStatus(organizationStatus: string) {
    this.props.organizationStatus = organizationStatus;
  }

  set organizationType(organizationType: string) {
    this.props.organizationType = organizationType;
  }

  set ownerId(ownerId: number) {
    this.props.ownerId = ownerId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
