import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LTYProgramStatus } from '@prisma/client';
import { CreateDto } from '@loyalty/loyalty/loyaltyProgram/use-cases/dto/create.dto';
import { User } from "@platform-user/user/domain/user";
import { RedisService } from '@infra/cache/redis.service';

@Injectable()
export class CreateLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(data: CreateDto, user: User): Promise<LTYProgram> {
    try {
      await this.redisService.del(`ability:${user.id}:`);
      console.log(`Invalidated ability cache for user ${user.id} before loyalty program creation`);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }

    const loyaltyProgram = new LTYProgram({
      name: data.name,
      ownerOrganizationId: data.ownerOrganizationId,
      status: LTYProgramStatus.ACTIVE,
      startDate: new Date(Date.now()),
      lifetimeDays: data?.lifetimeDays,
    });
    
    const createdLoyaltyProgram = await this.loyaltyProgramRepository.create(
      loyaltyProgram,
      data.ownerOrganizationId,
    );

    return createdLoyaltyProgram;
  }
}