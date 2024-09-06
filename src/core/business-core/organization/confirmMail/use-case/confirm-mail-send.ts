import { Injectable } from '@nestjs/common';
import { IMailAdapter } from '@libs/mail/adapter';
import { IOrganizationConfirmMailRepository } from '../interfaces/confirmMail';
import { IDateAdapter } from '@libs/date/adapter';
import * as randomstring from 'randomstring';
import { OrganizationConfirmMail } from '../domain/confirmMail';

@Injectable()
export class SendOrganizationConfirmMailUseCase {
  constructor(
    private readonly organizationConfirmRepository: IOrganizationConfirmMailRepository,
    private readonly dateService: IDateAdapter,
    private readonly mailService: IMailAdapter,
  ) {}

  async execute(
    email: string,
    subject: string,
    organizationId: number,
  ): Promise<any> {
    const confirmTime = this.dateService.generateOtpTime();
    const confirmString = randomstring.generate(15);
    const confirmModel = new OrganizationConfirmMail({
      email: email,
      organizationId: organizationId,
      confirmString: confirmString,
      expireDate: confirmTime,
      createDate: new Date(Date.now()),
    });
    const oldConfirmMail =
      await this.organizationConfirmRepository.findOne(email);
    if (oldConfirmMail) {
      await this.organizationConfirmRepository.removeOne(email);
    }
    const confirmMail =
      await this.organizationConfirmRepository.create(confirmModel);
    return await this.mailService.send(
      email,
      subject,
      'Код-приглашение в организацию: ' + confirmMail.confirmString,
    );
  }
}
