import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LTYProgramStatus } from '@prisma/client';
import { CreateDto } from '@loyalty/loyalty/loyaltyProgram/use-cases/dto/create.dto';
import { User } from "@platform-user/user/domain/user";

@Injectable()
export class CreateLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(data: CreateDto, user: User): Promise<LoyaltyProgram> {
    const loyaltyProgram = new LoyaltyProgram({
      name: data.name,
      status: LTYProgramStatus.ACTIVE,
      startDate: new Date(Date.now()),
      lifetimeDays: data?.lifetimeDays,
    });
    return await this.loyaltyProgramRepository.create(
      loyaltyProgram,
      data.organizationIds,
      user.id,
    );
  }
}
