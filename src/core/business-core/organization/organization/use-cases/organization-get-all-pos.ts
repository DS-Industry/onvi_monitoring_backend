import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';

@Injectable()
export class GetAllPosOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async execute(input: number): Promise<PosResponseDto[]> {
    const poses = await this.organizationRepository.findAllPos(input);
    if (poses.length == 0) {
      throw new Error('poses not exists');
    }
    return await Promise.all(
      poses.map(
        async (item) => await this.posCreateFullDataUseCase.execute(item),
      ),
    );
  }
}
