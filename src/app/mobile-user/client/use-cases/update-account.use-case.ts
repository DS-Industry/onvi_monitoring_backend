import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { UpdateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-update';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { AccountClientUpdateDto } from '../controller/dto/account-client-update.dto';
import { AccountNotFoundExceptions } from '../exceptions/account-not-found.exceptions';
import { AvatarType } from '../domain/avatar-type.enum';

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
  ) {}

  async execute(input: AccountClientUpdateDto, client: Client) {
    const { name, email, avatar, is_notifications_enabled } = input;
    const coreUpdateData: any = {};

    if (name !== undefined) coreUpdateData.name = name;
    if (email !== undefined) coreUpdateData.email = email;

    if (avatar !== undefined) {
      if (avatar === 1) {
        coreUpdateData.avatar = AvatarType.ONE;
      } else if (avatar === 2) {
        coreUpdateData.avatar = AvatarType.TWO;
      } else if (avatar === 3) {
        coreUpdateData.avatar = AvatarType.THREE;
      }
    }

    if (is_notifications_enabled !== undefined) {
      coreUpdateData.is_notifications_enabled = is_notifications_enabled;
    }

    const updatedClient = await this.updateClientUseCase.execute(
      coreUpdateData,
      client,
    );

    if (!updatedClient) {
      throw new AccountNotFoundExceptions(client.phone);
    }

    return updatedClient;
  }
}
