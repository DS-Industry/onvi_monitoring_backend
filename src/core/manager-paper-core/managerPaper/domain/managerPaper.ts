import { ManagerPaperGroup } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ManagerPaperProps {
  id?: number;
  group: ManagerPaperGroup;
  posId: number;
  paperTypeId: number;
  eventDate: Date;
  sum: number;
  userId: number;
  imageProductReceipt?: string;
  comment?: string;
  cashCollectionId?: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}

export class ManagerPaper extends BaseEntity<ManagerPaperProps> {
  constructor(props: ManagerPaperProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get group(): ManagerPaperGroup {
    return this.props.group;
  }

  set group(group: ManagerPaperGroup) {
    this.props.group = group;
  }

  get posId(): number {
    return this.props.posId;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  get paperTypeId(): number {
    return this.props.paperTypeId;
  }

  set paperTypeId(paperTypeId: number) {
    this.props.paperTypeId = paperTypeId;
  }

  get eventDate(): Date {
    return this.props.eventDate;
  }

  set eventDate(eventDate: Date) {
    this.props.eventDate = eventDate;
  }

  get sum(): number {
    return this.props.sum;
  }

  set sum(sum: number) {
    this.props.sum = sum;
  }

  get userId(): number {
    return this.props.userId;
  }

  set userId(userId: number) {
    this.props.userId = userId;
  }

  get imageProductReceipt(): string {
    return this.props.imageProductReceipt;
  }

  set imageProductReceipt(imageProductReceipt: string) {
    this.props.imageProductReceipt = imageProductReceipt;
  }

  get comment(): string {
    return this.props.comment;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  get cashCollectionId(): number {
    return this.props.cashCollectionId;
  }

  set cashCollectionId(cashCollectionId: number) {
    this.props.cashCollectionId = cashCollectionId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  get createdById(): number {
    return this.props.createdById;
  }

  set createdById(createdById: number) {
    this.props.createdById = createdById;
  }

  get updatedById(): number {
    return this.props.updatedById;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
