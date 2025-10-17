import { BaseEntity } from '@utils/entity';
import { LTYProgramStatus } from "@prisma/client";

export type BonusBurnoutType = 'year' | 'month' | 'custom';

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
  programParticipantOrganizationIds?: number[];
  description?: string;
  maxLevels: number;
  burnoutType?: BonusBurnoutType;
  lifetimeBonusDays?: number;
  maxRedeemPercentage?: number;
  hasBonusWithSale?: boolean;
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

  get description(): string {
    return this.props.description;
  }

  get maxLevels(): number {
    return this.props.maxLevels;
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
  get programParticipantOrganizationIds(): number[] {
    return this.props.programParticipantOrganizationIds || [];
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

  set programParticipantOrganizationIds(programParticipantIds: number[]) {
    this.props.programParticipantOrganizationIds = programParticipantIds;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set maxLevels(maxLevels: number) {
    this.props.maxLevels = maxLevels;
  }

  get burnoutType(): BonusBurnoutType {
    return this.props.burnoutType;
  }

  set burnoutType(burnoutType: BonusBurnoutType) {
    this.props.burnoutType = burnoutType;
  }

  get lifetimeBonusDays(): number {
    return this.props.lifetimeBonusDays;
  }

  set lifetimeBonusDays(lifetimeBonusDays: number) {
    this.props.lifetimeBonusDays = lifetimeBonusDays;
  }

  getCalculatedExpiryDate(creationDate: Date = new Date()): Date {
    const expiryDate = new Date(creationDate);

    if (!this.burnoutType) {
      const days = this.lifetimeBonusDays || 0;
      expiryDate.setUTCDate(expiryDate.getUTCDate() + days);
      return expiryDate;
    }

    switch (this.burnoutType) {
      case 'year':
        expiryDate.setUTCFullYear(expiryDate.getUTCFullYear() + 1);
        break;
      case 'month':
        expiryDate.setUTCMonth(expiryDate.getUTCMonth() + 1);
        break;
      case 'custom':
        const days = this.lifetimeBonusDays || 0;
        expiryDate.setUTCDate(expiryDate.getUTCDate() + days);
        break;
      default:
        const fallbackDays = this.lifetimeBonusDays || 0;
        expiryDate.setUTCDate(expiryDate.getUTCDate() + fallbackDays);
    }

    return expiryDate;
  }

  get maxRedeemPercentage(): number {
    return this.props.maxRedeemPercentage;
  }

  set maxRedeemPercentage(maxRedeemPercentage: number) {
    this.props.maxRedeemPercentage = maxRedeemPercentage;
  }

  get hasBonusWithSale(): boolean {
    return this.props.hasBonusWithSale || false;
  }

  set hasBonusWithSale(hasBonusWithSale: boolean) {
    this.props.hasBonusWithSale = hasBonusWithSale;
  }
}
