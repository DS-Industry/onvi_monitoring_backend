import { Injectable } from '@nestjs/common';
import { UpdateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-get-by-id';
import { ClientUpdateDto as CoreClientUpdateDto } from '@loyalty/mobile-user/client/use-cases/dto/client-update.dto';
import { UpdateClientDto } from '../controller/dto/update-client.dto';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class UpdateClientUseCaseWrapper {
  constructor(
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly getByIdClientUseCase: GetByIdClientUseCase,
  ) {}

  async execute(id: number, dto: UpdateClientDto): Promise<any> {
    const existingClient = await this.getByIdClientUseCase.execute(id);

    const coreUpdateData: CoreClientUpdateDto = {
      name: dto.name,
      status: dto.status ? (dto.status as StatusUser) : undefined,
      avatar: dto.avatar,
      refreshTokenId: dto.refreshTokenId,
      email: dto.email,
    };

    return await this.updateClientUseCase.execute(coreUpdateData, existingClient);
  }
}

