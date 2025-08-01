import {
  StatusWorkDayShiftReport,
  TypeEstimation,
  TypeWorkDay,
} from '@prisma/client';

export class ShiftReportReceiverResponseDto {
  id: number;
  workerId: number;
  posId: number;
  workerName?: string;
  totalCar?: number;
  workDate: Date;
  typeWorkDay: TypeWorkDay;
  timeWorkedOut?: string;
  startWorkingTime?: Date;
  endWorkingTime?: Date;
  estimation?: TypeEstimation;
  status?: StatusWorkDayShiftReport;
  cashAtStart?: number;
  cashAtEnd?: number;
  comment?: string;
  gradingParameterInfo: {
    parameters: GradingParameterInfo[];
    allEstimations: GradingEstimationInfo[];
  };
}

export class GradingParameterInfo {
  id: number;
  name: string;
  estimationId?: number;
}

export class GradingEstimationInfo {
  id: number;
  name: string;
}
