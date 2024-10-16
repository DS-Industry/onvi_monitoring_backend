import { Injectable } from "@nestjs/common";
import { IPosRepository } from "@pos/pos/interface/pos";
import { CreateFullDataPosUseCase } from "@pos/pos/use-cases/pos-create-full-data";
import { PosResponseDto } from "@platform-user/core-controller/dto/response/pos-response.dto";
import { Pos } from "@pos/pos/domain/pos";

@Injectable()
export class FindMethodsPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async getByIdFull(input: number): Promise<PosResponseDto> {
    const pos = await this.posRepository.findOneById(input);
    return this.posCreateFullDataUseCase.execute(pos);
  }

  async getById(input: number): Promise<Pos> {
    return await this.posRepository.findOneById(input);
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

  async getAllByAbility(input: any): Promise<PosResponseDto[]> {
    const poses = await this.posRepository.findAllByPermission(input);
    return await Promise.all(
      poses.map(
        async (pos) => await this.posCreateFullDataUseCase.execute(pos),
      ),
    );
  }

  async getAllByAbilityPos(input: any): Promise<Pos[]> {
    return await this.posRepository.findAllByPermission(input);
  }
}
