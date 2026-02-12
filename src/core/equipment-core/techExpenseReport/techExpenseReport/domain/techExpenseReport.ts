import { TechExpenseReportStatus } from "@prisma/client";
import { BaseEntity } from "@utils/entity";

export interface TechExpenseReportProps {
  id?: number;
  posId: number;
  startPeriod: Date;
  endPeriod: Date;
  status: TechExpenseReportStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}

export class TechExpenseReport extends BaseEntity<TechExpenseReportProps> {
  constructor(props: TechExpenseReportProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get posId(): number {
    return this.props.posId;
  }

  set posId(posId: number) {
    this.props.posId = posId;
  }

  get startPeriod(): Date {
    return this.props.startPeriod;
  }

  set startPeriod(startPeriod: Date) {
    this.props.startPeriod = startPeriod;
  }

  get endPeriod(): Date {
    return this.props.endPeriod;
  }

  set endPeriod(endPeriod: Date) {
    this.props.endPeriod = endPeriod;
  }

  get status(): TechExpenseReportStatus {
    return this.props.status;
  }

  set status(status: TechExpenseReportStatus) {
    this.props.status = status;
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