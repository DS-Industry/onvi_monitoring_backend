import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';

@Injectable()
export class GetByIdPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async execute(input: number): Promise<PosResponseDto> {
    const pos = await this.posRepository.findOneById(input);
    if (!pos) {
      throw new Error('pos not exists');
    }
    console.log(pos);
    return this.posCreateFullDataUseCase.execute(pos);
  }
}
