import { Injectable } from '@nestjs/common';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class ConnectionUserLoyaltyProgramUseCase {
  constructor(
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(loyaltyProgramIds: number[], userId: number) {
    const existingLoyaltyPrograms =
      await this.findMethodsLoyaltyProgramUseCase.getAllByUserId(userId);
    const existingLoyaltyProgramIds = existingLoyaltyPrograms.map((loyaltyProgram) => loyaltyProgram.id);
    const deleteLoyaltyProgramIds = existingLoyaltyProgramIds.filter((id) => !loyaltyProgramIds.includes(id));
    const addLoyaltyProgramIds = loyaltyProgramIds.filter((id) => !existingLoyaltyProgramIds.includes(id));

    await this.userRepository.updateConnectionLoyaltyProgram(
      userId,
      addLoyaltyProgramIds,
      deleteLoyaltyProgramIds,
    );
    return { status: 'SUCCESS' };
  }
}
