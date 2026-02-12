import { BaseEntity } from "@utils/entity";

export interface TechExpenseReportItemProps {
  id?: number;
  techConsumablesId: number;
  techExpenseReportId: number;
  quantityAtStart: number;
  quantityByReport: number;
  quantityOnWarehouse: number;
  quantityWriteOff?: number;
  quantityAtEnd?: number;
}

export class TechExpenseReportItem extends BaseEntity<TechExpenseReportItemProps> {
  constructor(props: TechExpenseReportItemProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get techConsumablesId(): number {
    return this.props.techConsumablesId;
  }

  set techConsumablesId(techConsumablesId: number) {
    this.props.techConsumablesId = techConsumablesId;
  }

  get techExpenseReportId(): number {
    return this.props.techExpenseReportId;
  }

  set techExpenseReportId(techExpenseReportId: number) {
    this.props.techExpenseReportId = techExpenseReportId;
  }

  get quantityAtStart(): number {
    return this.props.quantityAtStart;
  }

  set quantityAtStart(quantityAtStart: number) {
    this.props.quantityAtStart = quantityAtStart;
  }

  get quantityByReport(): number {
    return this.props.quantityByReport;
  }

  set quantityByReport(quantityByReport: number) {
    this.props.quantityByReport = quantityByReport;
  }

  get quantityOnWarehouse(): number {
    return this.props.quantityOnWarehouse;
  }

  set quantityOnWarehouse(quantityOnWarehouse: number) {
    this.props.quantityOnWarehouse = quantityOnWarehouse;
  }

  get quantityWriteOff(): number {
    return this.props.quantityWriteOff;
  }

  set quantityWriteOff(quantityWriteOff: number) {
    this.props.quantityWriteOff = quantityWriteOff;
  }

  get quantityAtEnd(): number {
    return this.props.quantityAtEnd;
  }

  set quantityAtEnd(quantityAtEnd: number) {
    this.props.quantityAtEnd = quantityAtEnd;
  }
}