import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';
import { Client } from '../domain/client.entity';

@Injectable()
export class GetClientByIdUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: number): Promise<Client | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid client ID');
    }

    const client = await this.clientRepository.findById(id);
    
    if (!client) {
      throw new Error(`Client with ID ${id} not found`);
    }

    return client;
  }
}
