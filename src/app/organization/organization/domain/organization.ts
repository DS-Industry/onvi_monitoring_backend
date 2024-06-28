import { BaseEntity } from '@utils/entity';
import { StatusOrganization, TypeOrganization } from '@prisma/client';
import { Address } from "@address/domain/address";

export interface OrganizationProps {
  id?: number;
  name: string;
  slug: string;
  addressId?: number;
  address?: Address;
  organizationDocumentId?: number;
  organizationStatus: StatusOrganization;
  organizationType: TypeOrganization;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId?: number;
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

  get address(): Address {
    return this.props.address;
  }

  get organizationDocumentId(): number {
    return this.props.organizationDocumentId;
  }

  get organizationStatus(): StatusOrganization {
    return this.props.organizationStatus;
  }

  get organizationType(): TypeOrganization {
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

  set address(address: Address) {
    this.props.address = address;
  }

  set organizationDocumentId(organizationDocumentId: number) {
    this.props.organizationDocumentId = organizationDocumentId;
  }

  set organizationStatus(organizationStatus: StatusOrganization) {
    this.props.organizationStatus = organizationStatus;
  }

  set organizationType(organizationType: TypeOrganization) {
    this.props.organizationType = organizationType;
  }

  set ownerId(ownerId: number) {
    this.props.ownerId = ownerId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
