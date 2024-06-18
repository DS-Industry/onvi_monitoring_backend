import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { UpdateClientDto } from '@mobile-user/client/controller/dto/client-update.dto';

@Injectable()
export class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(input: UpdateClientDto) {
    const client = await this.clientRepository.findOneById(input.id);
    if (!client) {
      throw new Error('client not exists');
    }
    const {
      name,
      surname,
      middlename,
      avatar,
      country,
      countryCode,
      timezone,
      refreshTokenId,
      status,
      loyaltyCardId,
      mobileUserRoleId,
    } = input;

    client.name = name ? name : client.name;
    client.surname = surname ? surname : client.surname;
    client.middlename = middlename ? middlename : client.middlename;
    client.avatar = avatar ? avatar : client.avatar;
    client.country = country ? country : client.country;
    client.countryCode = countryCode ? countryCode : client.countryCode;
    client.timezone = timezone ? timezone : client.timezone;
    client.refreshTokenId = refreshTokenId
      ? refreshTokenId
      : client.refreshTokenId;
    client.status = status ? status : client.status;
    client.loyaltyCardId = loyaltyCardId ? loyaltyCardId : client.loyaltyCardId;
    client.mobileUserRoleId = mobileUserRoleId
      ? mobileUserRoleId
      : client.mobileUserRoleId;

    return await this.clientRepository.update(client.id, client);
  }
}
