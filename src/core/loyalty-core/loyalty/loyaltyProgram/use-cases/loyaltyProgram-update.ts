import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { UpdateDto } from '@loyalty/loyalty/loyaltyProgram/use-cases/dto/update.dto';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

@Injectable()
export class UpdateLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(
    input: UpdateDto,
    oldLoyaltyProgram: LTYProgram,
  ): Promise<LTYProgram> {
    const { name, description, maxLevels, lifetimeDays } = input;

    oldLoyaltyProgram.name = name ? name : oldLoyaltyProgram.name;
    oldLoyaltyProgram.description = description ? description : oldLoyaltyProgram.description;
    oldLoyaltyProgram.maxLevels = maxLevels ? maxLevels : oldLoyaltyProgram.maxLevels;
    oldLoyaltyProgram.lifetimeDays = lifetimeDays ? lifetimeDays : oldLoyaltyProgram.lifetimeDays;

    return await this.loyaltyProgramRepository.update(
      oldLoyaltyProgram,
    );
  }
}
