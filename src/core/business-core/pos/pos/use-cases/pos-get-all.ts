import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';

@Injectable()
export class GetAllPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async execute(): Promise<PosResponseDto[]> {
    const poses = await this.posRepository.findAll();
    if (poses.length == 0) {
      return [];
    }
    return await Promise.all(
      poses.map(
        async (pos) => await this.posCreateFullDataUseCase.execute(pos),
      ),
    );
  }
}
