import { Injectable } from '@nestjs/common';
import { IClientMetaRepository } from '@loyalty/mobile-user/client/interfaces/clientMeta';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';
import { ClientMetaCreateDto } from '../controller/dto/client-meta-create.dto';

@Injectable()
export class CreateClientMetaUseCase {
  constructor(private readonly clientMetaRepository: IClientMetaRepository) {}

  async execute(dto: ClientMetaCreateDto): Promise<ClientMeta> {
    const existingMeta = await this.clientMetaRepository.findOneByClientId(dto.clientId);
    if (existingMeta) {
      throw new Error('Meta already exists for this client');
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
