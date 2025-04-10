import { BenefitType } from "@prisma/client";

export class UpdateDto {
  name?: string;
  bonus?: number;
  benefitType?: BenefitType;
}