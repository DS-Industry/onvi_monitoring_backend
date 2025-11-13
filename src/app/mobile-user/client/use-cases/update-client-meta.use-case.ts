import { Injectable } from '@nestjs/common';
import { IClientMetaRepository } from '@loyalty/mobile-user/client/interfaces/clientMeta';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';
import { ClientMetaUpdateDto } from '../controller/dto/client-meta-update.dto';
import { ClientMetaNotFoundExceptions } from '@mobile-user/shared/exceptions/clinet.exceptions';

@Injectable()
export class UpdateClientMetaUseCase {
  constructor(private readonly clientMetaRepository: IClientMetaRepository) {}

  async execute(dto: ClientMetaUpdateDto): Promise<ClientMeta> {
    const existingMeta = await this.clientMetaRepository.findOneById(
      dto.metaId,
    );
    if (!existingMeta) {
      throw new ClientMetaNotFoundExceptions(dto.metaId);
    }

    if (dto.deviceId !== undefined) existingMeta.deviceId = dto.deviceId;
    if (dto.model !== undefined) existingMeta.model = dto.model;
    if (dto.name !== undefined) existingMeta.name = dto.name;
    if (dto.platform !== undefined) existingMeta.platform = dto.platform;

    return await this.clientMetaRepository.update(existingMeta);
  }
}
