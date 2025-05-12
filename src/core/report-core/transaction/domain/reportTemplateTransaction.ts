import { StatusReportTemplate } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ReportTemplateTransactionProps {
  id?: number;
  reportTemplateId: number;
  userId: number;
  reportKey?: string;
  startTemplateAt: Date;
  endTemplateAt?: Date;
  status: StatusReportTemplate;
}

export class ReportTemplateTransaction extends BaseEntity<ReportTemplateTransactionProps> {
  constructor(props: ReportTemplateTransactionProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get reportTemplateId(): number {
    return this.props.reportTemplateId;
  }

  get userId(): number {
    return this.props.userId;
  }

  get reportKey(): string {
    return this.props.reportKey;
  }

  get startTemplateAt(): Date {
    return this.props.startTemplateAt;
  }

  get endTemplateAt(): Date {
    return this.props.endTemplateAt;
  }

  get status(): StatusReportTemplate {
    return this.props.status;
  }

  set reportKey(reportKey: string) {
    this.props.reportKey = reportKey;
  }

  set endTemplateAt(endTemplateAt: Date) {
    this.props.endTemplateAt = endTemplateAt;
  }

  set status(status: StatusReportTemplate) {
    this.props.status = status;
  }
}
