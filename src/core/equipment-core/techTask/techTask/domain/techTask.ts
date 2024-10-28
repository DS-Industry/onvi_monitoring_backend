import { PeriodTechTask, StatusTechTask, TypeTechTask } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface TechTaskProps {
  id?: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  period: PeriodTechTask;
  startDate: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
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

  get type(): TypeTechTask {
    return this.props.type;
  }

  get status(): StatusTechTask {
    return this.props.status;
  }

  get period(): PeriodTechTask {
    return this.props.period;
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

  set period(period: PeriodTechTask) {
    this.props.period = period;
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
}
