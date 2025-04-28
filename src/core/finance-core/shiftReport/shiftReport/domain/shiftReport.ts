import { BaseEntity } from '@utils/entity';

export interface ShiftReportProps {
  id?: number;
  posId?: number;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
}

export class ShiftReport extends BaseEntity<ShiftReportProps> {
  constructor(props: ShiftReportProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }

  get posId(): number {
    return this.props.posId;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
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

  set posId(posId: number) {
    this.props.posId = posId;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  set endDate(endDate: Date) {
    this.props.endDate = endDate;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
