import { BaseEntity } from '@utils/entity';

export interface IncidentProps {
  id?: number;
  posId: number;
  workerId: number;
  appearanceDate: Date;
  startDate: Date;
  finishDate: Date;
  objectName: string;
  equipmentKnotId?: number;
  incidentNameId?: number;
  incidentReasonId?: number;
  incidentSolutionId?: number;
  downtime: number;
  comment: string;
  carWashDeviceProgramsTypeId?: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}

export class Incident extends BaseEntity<IncidentProps> {
  constructor(props: IncidentProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get posId(): number {
    return this.props.posId;
  }

  get workerId(): number {
    return this.props.workerId;
  }

  get appearanceDate(): Date {
    return this.props.appearanceDate;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get finishDate(): Date {
    return this.props.finishDate;
  }

  get objectName(): string {
    return this.props.objectName;
  }

  get equipmentKnotId(): number {
    return this.props.equipmentKnotId;
  }

  get incidentNameId(): number {
    return this.props.incidentNameId;
  }

  get incidentReasonId(): number {
    return this.props.incidentReasonId;
  }

  get incidentSolutionId(): number {
    return this.props.incidentSolutionId;
  }

  get downtime(): number {
    return this.props.downtime;
  }

  get comment(): string {
    return this.props.comment;
  }

  get carWashDeviceProgramsTypeId(): number {
    return this.props.carWashDeviceProgramsTypeId;
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

  set workerId(workerId: number) {
    this.props.workerId = workerId;
  }

  set appearanceDate(appearanceDate: Date) {
    this.props.appearanceDate = appearanceDate;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  set finishDate(finishDate: Date) {
    this.props.finishDate = finishDate;
  }

  set objectName(objectName: string) {
    this.props.objectName = objectName;
  }

  set equipmentKnotId(equipmentKnotId: number) {
    this.props.equipmentKnotId = equipmentKnotId;
  }

  set incidentNameId(incidentNameId: number) {
    this.props.incidentNameId = incidentNameId;
  }

  set incidentReasonId(incidentReasonId: number) {
    this.props.incidentReasonId = incidentReasonId;
  }

  set incidentSolutionId(incidentSolutionId: number) {
    this.props.incidentSolutionId = incidentSolutionId;
  }

  set downtime(downtime: number) {
    this.props.downtime = downtime;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  set carWashDeviceProgramsTypeId(carWashDeviceProgramsTypeId: number) {
    this.props.carWashDeviceProgramsTypeId = carWashDeviceProgramsTypeId;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  set updatedById(updatedById: number) {
    this.props.updatedById = updatedById;
  }
}
