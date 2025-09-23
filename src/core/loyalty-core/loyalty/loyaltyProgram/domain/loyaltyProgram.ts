import { BaseEntity } from '@utils/entity';
import { LTYProgramStatus } from "@prisma/client";

export interface LTYProgramProps {
  id?: number;
  name: string;
  status: LTYProgramStatus;
  ownerOrganizationId: number;
  startDate: Date;
  lifetimeDays?: number;
  isHub?: boolean;
  isHubRequested?: boolean
  isHubRejected?: boolean
  isPublic?: boolean;
}

export class LTYProgram extends BaseEntity<LTYProgramProps> {
  constructor(props: LTYProgramProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): LTYProgramStatus {
    return this.props.status;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get lifetimeDays(): number {
    return this.props.lifetimeDays;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get ownerOrganizationId(): number {
    return this.props.ownerOrganizationId;
  }

  set status(status: LTYProgramStatus) {
    this.props.status = status;
  }

  set startDate(startDate: Date) {
    this.props.startDate = startDate;
  }

  set lifetimeDays(lifetimeDays: number) {
    this.props.lifetimeDays = lifetimeDays;
  }

  set ownerOrganizationId(ownerOrganizationId: number) {
    this.props.ownerOrganizationId = ownerOrganizationId;
  }

  get isHub(): boolean {
    return this.props.isHub || false;
  }

  get isHubRequested(): boolean {
    return this.props.isHubRequested || false;
  }

  get isHubRejected(): boolean {
    return this.props.isHubRejected || false;
  }

  set isHub(isHub: boolean) {
    this.props.isHub = isHub;
  }

  get isPublic(): boolean {
    return this.props.isPublic || false;
  }

  set isPublic(isPublic: boolean) {
    this.props.isPublic = isPublic;
  }
}
