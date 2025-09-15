import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';
import { Client } from '../domain/client.entity';
import { CreateClientDto } from '../controller/dto/client-create.dto';
import { StatusUser, ContractType } from '@prisma/client';

@Injectable()
export class CreateClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(createData: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findByPhone(createData.phone);
    if (existingClient) {
      throw new Error(`Client with phone ${createData.phone} already exists`);
    }

    if (createData.email) {
      const existingClientByEmail = await this.clientRepository.findByEmail(createData.email);
      if (existingClientByEmail) {
        throw new Error(`Client with email ${createData.email} already exists`);
      }
    }

    const client = new Client({
      name: createData.name,
      phone: createData.phone,
      email: createData.email,
      gender: createData.gender,
      status: createData.status || StatusUser.ACTIVE,
      avatar: createData.avatar,
      contractType: createData.contractType || ContractType.INDIVIDUAL,
      comment: createData.comment,
      birthday: createData.birthday ? new Date(createData.birthday) : undefined,
      placementId: createData.placementId,
      workerCorporateId: createData.workerCorporateId,
      refreshTokenId: createData.refreshTokenId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.clientRepository.create(client);
  }
}
