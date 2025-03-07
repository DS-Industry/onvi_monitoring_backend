import { Injectable } from '@nestjs/common';
import { IMailAdapter } from '@libs/mail/adapter';
import { IOrganizationConfirmMailRepository } from '../interfaces/confirmMail';
import { IDateAdapter } from '@libs/date/adapter';
import * as randomstring from 'randomstring';
import { OrganizationConfirmMail } from '../domain/confirmMail';
import { ConfirmMailCreateDto } from '@organization/confirmMail/use-case/dto/confirm-mail-create.dto';
import { StatusDeviceDataRaw } from '@prisma/client';

@Injectable()
export class SendOrganizationConfirmMailUseCase {
  constructor(
    private readonly organizationConfirmRepository: IOrganizationConfirmMailRepository,
    private readonly dateService: IDateAdapter,
    private readonly mailService: IMailAdapter,
  ) {}

  async execute(data: ConfirmMailCreateDto, subject: string): Promise<any> {
    const confirmTime = this.dateService.generateOtpTime();
    const confirmString = randomstring.generate(15);
    const confirmModel = new OrganizationConfirmMail({
      email: data.email,
      organizationId: data.organizationId,
      roleId: data.roleId,
      confirmString: confirmString,
      name: data.name,
      surname: data?.surname,
      middlename: data?.middlename,
      phone: data.phone,
      birthday: data.birthday,
      position: data.position,
      status: StatusDeviceDataRaw.PENDING,
      expireDate: confirmTime,
      createDate: new Date(Date.now()),
    });
    const oldConfirmMail = await this.organizationConfirmRepository.findOne(
      data.email,
    );
    if (oldConfirmMail) {
      await this.organizationConfirmRepository.removeOne(data.email);
    }
    const confirmMail =
      await this.organizationConfirmRepository.create(confirmModel);
    return await this.mailService.send(
      data.email,
      subject,
      'Код-приглашение в организацию: ' + confirmMail.confirmString,
    );
  }
}
