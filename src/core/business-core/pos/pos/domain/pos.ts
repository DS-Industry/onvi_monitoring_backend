import { Address } from '@address/domain/address';
import { BaseEntity } from '@utils/entity';
import { CarWashPosType, StatusPos } from '@prisma/client';

export interface PosProps {
  id?: number;
  name: string;
  slug: string;
  startTime?: string;
  endTime?: string;
  organizationId: number;
  posMetaData?: string;
  timezone: number;
  addressId?: number;
  placementId?: number;
  address?: Address;
  image?: string;
  rating?: number;
  status: StatusPos;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
  carWashPosType?: CarWashPosType;
  minSumOrder?: number;
  maxSumOrder?: number;
  stepSumOrder?: number;
}

export class Pos extends BaseEntity<PosProps> {
  constructor(props: PosProps) {
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

  get startTime(): string {
    return this.props.startTime;
  }

  get endTime(): string {
    return this.props.endTime;
  }

  get organizationId(): number {
    return this.props.organizationId;
  }

  get placementId(): number {
    return this.props.placementId;
  }

  get posMetaData(): string {
    return this.props.posMetaData;
  }

  get timezone(): number {
    return this.props.timezone;
  }

  get addressId(): number {
    return this.props.addressId;
  }

  get address(): Address {
    return this.props.address;
  }

  get image(): string {
    return this.props.image;
  }

  get rating(): number {
    return this.props.rating;
  }

  get status(): StatusPos {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  get carWashPosType(): CarWashPosType {
    return this.props.carWashPosType;
  }

  get minSumOrder(): number {
    return this.props.minSumOrder;
  }

  get maxSumOrder(): number {
    return this.props.maxSumOrder;
  }

  get stepSumOrder(): number {
    return this.props.stepSumOrder;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set slug(slug: string) {
    this.props.slug = slug;
  }

  set startTime(startTime: string) {
    this.props.startTime = startTime;
  }

  set endTime(endTime: string) {
    this.props.endTime = endTime;
  }

  set organizationId(organizationId: number) {
    this.props.organizationId = organizationId;
  }

  set posMetaData(posMetaData: string) {
    this.props.posMetaData = posMetaData;
  }

  set timezone(timezone: number) {
    this.props.timezone = timezone;
  }

  set addressId(addressId: number) {
    this.props.addressId = addressId;
  }

  set address(address: Address) {
    this.props.address = address;
  }

  set image(image: string) {
    this.props.image = image;
  }

  set rating(rating: number) {
    this.props.rating = rating;
  }

  set status(status: StatusPos) {
    this.props.status = status;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }

  set carWashPosType(carWashPosType: CarWashPosType) {
    this.props.carWashPosType = carWashPosType;
  }

  set minSumOrder(minSumOrder: number) {
    this.props.minSumOrder = minSumOrder;
  }

  set maxSumOrder(maxSumOrder: number) {
    this.props.maxSumOrder = maxSumOrder;
  }

  set stepSumOrder(stepSumOrder: number) {
    this.props.stepSumOrder = stepSumOrder;
  }
}
