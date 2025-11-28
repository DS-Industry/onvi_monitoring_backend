import { BaseEntity } from '@utils/entity';
import { StatusHrWorker } from '@prisma/client';

export interface WorkerProps {
  id?: number;
  name: string;
  hrPositionId: number;
  placementId: number;
  organizationId: number;
  startWorkDate?: Date;
  phone?: string;
  email?: string;
  description?: string;
  avatar?: string;
  monthlySalary: number;
  dailySalary: number;
  bonusPayout: number;
  status: StatusHrWorker;
  gender?: string;
  birthday?: Date;
  citizenship?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportExtradition?: string;
  passportDateIssue?: Date;
  inn?: string;
  snils?: string;
  registrationAddress?: string;
}

export class Worker extends BaseEntity<WorkerProps> {
  constructor(props: WorkerProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get hrPositionId(): number {
    return this.props.hrPositionId;
  }

  set hrPositionId(hrPositionId: number) {
    this.props.hrPositionId = hrPositionId;
  }

  get placementId(): number {
    return this.props.placementId;
  }

  set placementId(placementId: number) {
    this.props.placementId = placementId;
  }

  get organizationId(): number {
    return this.props.organizationId;
  }

  set organizationId(organizationId: number) {
    this.props.organizationId = organizationId;
  }

  get startWorkDate(): Date {
    return this.props.startWorkDate;
  }

  set startWorkDate(startWorkDate: Date) {
    this.props.startWorkDate = startWorkDate;
  }

  get phone(): string {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get avatar(): string {
    return this.props.avatar;
  }

  set avatar(avatar: string) {
    this.props.avatar = avatar;
  }

  get monthlySalary(): number {
    return this.props.monthlySalary;
  }

  set monthlySalary(monthlySalary: number) {
    this.props.monthlySalary = monthlySalary;
  }

  get dailySalary(): number {
    return this.props.dailySalary;
  }

  set dailySalary(dailySalary: number) {
    this.props.dailySalary = dailySalary;
  }

  get bonusPayout(): number {
    return this.props.bonusPayout;
  }

  set bonusPayout(bonusPayout: number) {
    this.props.bonusPayout = bonusPayout;
  }

  get status(): StatusHrWorker {
    return this.props.status;
  }

  set status(status: StatusHrWorker) {
    this.props.status = status;
  }

  get gender(): string {
    return this.props.gender;
  }

  set gender(gender: string) {
    this.props.gender = gender;
  }

  get birthday(): Date {
    return this.props.birthday;
  }

  set birthday(birthday: Date) {
    this.props.birthday = birthday;
  }

  get citizenship(): string {
    return this.props.citizenship;
  }

  set citizenship(citizenship: string) {
    this.props.citizenship = citizenship;
  }

  get passportSeries(): string {
    return this.props.passportSeries;
  }

  set passportSeries(passportSeries: string) {
    this.props.passportSeries = passportSeries;
  }

  get passportNumber(): string {
    return this.props.passportNumber;
  }

  set passportNumber(passportNumber: string) {
    this.props.passportNumber = passportNumber;
  }

  get passportExtradition(): string {
    return this.props.passportExtradition;
  }

  set passportExtradition(passportExtradition: string) {
    this.props.passportExtradition = passportExtradition;
  }

  get passportDateIssue(): Date {
    return this.props.passportDateIssue;
  }

  set passportDateIssue(passportDateIssue: Date) {
    this.props.passportDateIssue = passportDateIssue;
  }

  get inn(): string {
    return this.props.inn;
  }

  set inn(inn: string) {
    this.props.inn = inn;
  }

  get snils(): string {
    return this.props.snils;
  }

  set snils(snils: string) {
    this.props.snils = snils;
  }

  get registrationAddress(): string {
    return this.props.registrationAddress;
  }

  set registrationAddress(registrationAddress: string) {
    this.props.registrationAddress = registrationAddress;
  }
}
