import { Injectable } from '@nestjs/common';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class ConnectionUserPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(posIds: number[], userId: number) {
    const existingPoses =
      await this.findMethodsPosUseCase.getAllByUserId(userId);
    const existingPosIds = existingPoses.map((pos) => pos.id);

    const deletePosIds = existingPosIds.filter((id) => !posIds.includes(id)); // Удалить
    const addPosIds = posIds.filter((id) => !existingPosIds.includes(id));

    await this.userRepository.updateConnectionPos(
      userId,
      addPosIds,
      deletePosIds,
    );
    return { status: 'SUCCESS' };
  }
}
