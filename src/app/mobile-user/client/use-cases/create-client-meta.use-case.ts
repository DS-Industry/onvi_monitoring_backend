import { Injectable } from '@nestjs/common';
import { IClientMetaRepository } from '@loyalty/mobile-user/client/interfaces/clientMeta';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';
import { ClientMetaCreateDto } from '../controller/dto/client-meta-create.dto';
import { ClientMetaExistsExceptions } from '@mobile-user/shared/exceptions/clinet.exceptions';

@Injectable()
export class CreateClientMetaUseCase {
  constructor(private readonly clientMetaRepository: IClientMetaRepository) {}

  async execute(dto: ClientMetaCreateDto): Promise<ClientMeta> {
    const existingMeta = await this.clientMetaRepository.findOneByClientId(dto.clientId);
    if (existingMeta) {
      throw new ClientMetaExistsExceptions(dto.clientId);
    }

    const meta = new ClientMeta({
      clientId: dto.clientId,
      deviceId: dto.deviceId,
      model: dto.model,
      name: dto.name,
      platform: dto.platform,
    });

    return await this.clientMetaRepository.create(meta);
  }
}
