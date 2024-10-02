import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class FindMethodsPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async getById(input: number): Promise<PosResponseDto> {
    const pos = await this.posRepository.findOneById(input);
    if (!pos) {
      throw new Error('pos not exists');
    }
    return this.posCreateFullDataUseCase.execute(pos);
  }

  async getByName(input: string): Promise<Pos> {
    return await this.posRepository.findOneByName(input);
  }

  async getAll(): Promise<PosResponseDto[]> {
    const poses = await this.posRepository.findAll();
    return await Promise.all(
      poses.map(
        async (pos) => await this.posCreateFullDataUseCase.execute(pos),
      ),
    );
  }

  async getAllByAbility(input: any): Promise<Pos[]> {
    return this.posRepository.findAllByPermission(input);
  }
}
