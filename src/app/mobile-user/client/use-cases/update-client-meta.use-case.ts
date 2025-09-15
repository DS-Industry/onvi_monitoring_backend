import { Injectable } from '@nestjs/common';
import { ClientMetaRepository } from '../infrastructure/client-meta.repository';
import { ClientMeta } from '../domain/client-meta.entity';
import { ClientMetaUpdateDto } from '../controller/dto/client-meta-update.dto';

@Injectable()
export class UpdateClientMetaUseCase {
  constructor(private readonly clientMetaRepository: ClientMetaRepository) {}

  async execute(dto: ClientMetaUpdateDto): Promise<ClientMeta> {
    const existingMeta = await this.clientMetaRepository.findById(dto.metaId);
    if (!existingMeta) {
      throw new Error('Meta not found');
    }

    const updateData: Partial<ClientMeta> = {};
    
    if (dto.clientId !== undefined) updateData.clientId = dto.clientId;
    if (dto.deviceId !== undefined) updateData.deviceId = dto.deviceId;
    if (dto.model !== undefined) updateData.model = dto.model;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.platform !== undefined) updateData.platform = dto.platform;

    existingMeta.update(updateData);
    return await this.clientMetaRepository.update(existingMeta);
  }
}
