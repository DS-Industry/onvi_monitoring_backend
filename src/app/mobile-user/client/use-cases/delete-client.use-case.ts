import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';

@Injectable()
export class DeleteClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid client ID');
    }

    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new Error(`Client with ID ${id} not found`);
    }

    await this.clientRepository.delete(id);
  }
}
