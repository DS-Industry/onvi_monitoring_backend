import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';
import { Client } from '../domain/client.entity';
import { UpdateClientDto } from '../controller/dto/update-client.dto';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: number, updateData: UpdateClientDto): Promise<Client> {
    if (!id || id <= 0) {
      throw new Error('Invalid client ID');
    }

    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new Error(`Client with ID ${id} not found`);
    }

    existingClient.update({
      name: updateData.name || existingClient.name,
      email: updateData.email || existingClient.email,
      avatar: updateData.avatar || existingClient.avatar,
      status: updateData.status || existingClient.status,
      refreshTokenId: updateData.refreshTokenId || existingClient.refreshTokenId,
    });

    const updatedClient = await this.clientRepository.update(existingClient);
    
    return updatedClient;
  }
}
