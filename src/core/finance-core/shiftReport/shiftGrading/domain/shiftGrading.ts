import { BaseEntity } from '@utils/entity';

export interface ShiftGradingProps {
  id?: number;
  shiftReportId: number;
  gradingParameterId: number;
  gradingEstimationId?: number;
}

export class ShiftGrading extends BaseEntity<ShiftGradingProps> {
  constructor(props: ShiftGradingProps) {
    super(props);
  }
  get id(): number {
    return this.props.id;
  }
  get shiftReportId(): number {
    return this.props.shiftReportId;
  }
  get gradingParameterId(): number {
    return this.props.gradingParameterId;
  }
  get gradingEstimationId(): number {
    return this.props.gradingEstimationId;
  }
  set gradingEstimationId(gradingEstimationId: number) {
    this.props.gradingEstimationId = gradingEstimationId;
  }
}
