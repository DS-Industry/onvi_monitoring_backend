import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { TechTag } from '@tech-task/tag/domain/techTag';
import { BaseEntity } from '@utils/entity';
import { PeriodType } from './periodType';

export interface TechTaskProps {
  id?: number;
  name: string;
  posId: number;
  posName?: string;
  type: TypeTechTask;
  status: StatusTechTask;
  periodType?: PeriodType;
  customPeriodDays?: number;
  markdownDescription?: string;
  nextCreateDate?: Date;
  endSpecifiedDate?: Date;
  startDate: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
  templateToNextCreate: boolean;
  tags: TechTag[];
  createdBy?: {
    firstName: string;
    lastName: string;
    id: number;
  };
  executor?: {
    firstName: string;
    lastName: string;
    id: number;
  };
}

export class TechTask extends BaseEntity<TechTaskProps> {
  constructor(props: TechTaskProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get posId(): number {
    return this.props.posId;
  }

  get posName(): string {
    return this.props.posName;
  }

  get type(): TypeTechTask {
    return this.props.type;
  }

  get status(): StatusTechTask {
    return this.props.status;
  }

  get periodType(): PeriodType {
    return this.props.periodType;
  }

  get customPeriodDays(): number {
    return this.props.customPeriodDays;
  }

  get markdownDescription(): string {
    return this.props.markdownDescription;
  }

  get nextCreateDate(): Date {
    return this.props.nextCreateDate;
  }

  get endSpecifiedDate(): Date {
    return this.props.endSpecifiedDate;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get startWorkDate(): Date {
    return this.props.startWorkDate;
  }

  get sendWorkDate(): Date {
    return this.props.sendWorkDate;
  }

  get executorId(): number {
    return this.props.executorId;
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

  get templateToNextCreate(): boolean {
    return this.props.templateToNextCreate;
  }

  get tags(): TechTag[] {
    return this.props.tags;
  }

  get createdBy(): { firstName: string; lastName: string; id: number } {
    return this.props.createdBy;
  }

  get executor(): { firstName: string; lastName: string; id: number } {
    return this.props.executor;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  set type(type: TypeTechTask) {
    this.props.type = type;
  }

  set status(status: StatusTechTask) {
    this.props.status = status;
  }

  set periodType(periodType: PeriodType) {
    this.props.periodType = periodType;
  }

  set customPeriodDays(customPeriodDays: number) {
    this.props.customPeriodDays = customPeriodDays;
  }

  set markdownDescription(markdownDescription: string) {
    this.props.markdownDescription = markdownDescription;
  }

  set nextCreateDate(nextCreateDate: Date) {
    this.props.nextCreateDate = nextCreateDate;
  }

  set endSpecifiedDate(endSpecifiedDate: Date) {
    this.props.endSpecifiedDate = endSpecifiedDate;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  set startWorkDate(startWorkDate: Date) {
    this.props.startWorkDate = startWorkDate;
  }

  set sendWorkDate(sendWorkDate: Date) {
    this.props.sendWorkDate = sendWorkDate;
  }

  set executorId(executorId: number) {
    this.props.executorId = executorId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }

  set templateToNextCreate(templateToNextCreate: boolean) {
    this.props.templateToNextCreate = templateToNextCreate;
  }

  set tags(tags: TechTag[]) {
    this.props.tags = tags;
  }

  set createdBy(createdBy: {
    firstName: string;
    lastName: string;
    id: number;
  }) {
    this.props.createdBy = createdBy;
  }

  set executor(executor: { firstName: string; lastName: string; id: number }) {
    this.props.executor = executor;
  }
}
