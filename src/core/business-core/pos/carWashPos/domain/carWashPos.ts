import { BaseEntity } from '@utils/entity';
import { CarWashPosType } from '@prisma/client';

export interface CarWashPosProps {
  id?: number;
  name: string;
  slug: string;
  posId: number;
  carWashPosType: CarWashPosType;
  minSumOrder: number;
  maxSumOrder: number;
  stepSumOrder: number;
}

export class CarWashPos extends BaseEntity<CarWashPosProps> {
  constructor(props: CarWashPosProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get posId(): number {
    return this.props.posId;
  }

  get carWashPosType(): CarWashPosType {
    return this.props.carWashPosType;
  }

  get minSumOrder(): number {
    return this.props.minSumOrder;
  }

  get maxSumOrder(): number {
    return this.props.maxSumOrder;
  }

  get stepSumOrder(): number {
    return this.props.stepSumOrder;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set slug(slug: string) {
    this.props.slug = slug;
  }

  set carWashPosType(carWashPosType: CarWashPosType) {
    this.props.carWashPosType = carWashPosType;
  }

  set minSumOrder(minSumOrder: number) {
    this.props.minSumOrder = minSumOrder;
  }

  set maxSumOrder(maxSumOrder: number) {
    this.props.maxSumOrder = maxSumOrder;
  }

  set stepSumOrder(stepSumOrder: number) {
    this.props.stepSumOrder = stepSumOrder;
  }
}
