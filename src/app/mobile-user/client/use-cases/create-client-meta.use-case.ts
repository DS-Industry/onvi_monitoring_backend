import { Injectable } from '@nestjs/common';
import { ClientMetaRepository } from '../infrastructure/client-meta.repository';
import { ClientMeta } from '../domain/client-meta.entity';
import { ClientMetaCreateDto } from '../controller/dto/client-meta-create.dto';

@Injectable()
export class CreateClientMetaUseCase {
  constructor(private readonly clientMetaRepository: ClientMetaRepository) {}

  async execute(dto: ClientMetaCreateDto): Promise<ClientMeta> {
    const existingMeta = await this.clientMetaRepository.findByClientId(dto.clientId);
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
