import { IsArray, IsOptional } from "class-validator";

export class ConnectedLoyaltyProgramUserDto {
  @IsArray()
  @IsOptional()
  loyaltyProgramIds: number[];
}
