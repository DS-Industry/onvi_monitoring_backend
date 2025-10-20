import { LTYBenefitType } from "@prisma/client";

export class UpdateDto {
  name?: string;
  bonus?: number;
  benefitType?: LTYBenefitType;
  ltyProgramId?: number;
}