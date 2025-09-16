import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';
import { Client } from '../domain/client.entity';
import { AccountClientUpdateDto } from '../controller/dto/account-client-update.dto';
import { AccountNotFoundExceptions } from '../exceptions/account-not-found.exceptions';
import { AvatarType } from '../domain/avatar-type.enum';

@Injectable()
export class UpdateAccountUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(
    input: AccountClientUpdateDto,
    client: Client,
  ): Promise<Client> {
    const { name, email, avatar, notification, is_notifications_enabled } = input;

    if (avatar !== undefined) {
      if (avatar === 1) {
        client.avatar = AvatarType.ONE;
      } else if (avatar === 2) {
        client.avatar = AvatarType.TWO;
      } else if (avatar === 3) {
        client.avatar = AvatarType.THREE;
      }
    }

    if (name !== undefined) client.name = name;
    if (email !== undefined) client.email = email;
    if (is_notifications_enabled !== undefined) client.is_notifications_enabled = is_notifications_enabled;

    if (notification !== undefined) {
      client.isNotifications = notification ? 1 : 0;
    }

    const updatedClient = await this.clientRepository.update(client);

    if (!updatedClient) {
      throw new AccountNotFoundExceptions(client.correctPhone);
    }

    return updatedClient;
  }
}
