import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';

@Injectable()
export class GetByIdClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(input: number) {
    const client = await this.clientRepository.findOneById(input);
    if (!client) {
      throw new Error('client not exists');
    }
    return client;
  }
}
