import { IConfirmMailRepository } from '@platform-admin/confirmMail/interfaces/confirmMail';
import { IDateAdapter } from '@libs/date/adapter';
import * as randomstring from 'randomstring';
import { ConfirmMail } from '@platform-admin/confirmMail/domain/confirmMail';
import { IMailAdapter } from '@libs/mail/adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendConfirmMailUseCase {
  constructor(
    private readonly conformRepository: IConfirmMailRepository,
    private readonly dateService: IDateAdapter,
    private readonly mailService: IMailAdapter,
  ) {}

  async execute(email: string, subject: string): Promise<any> {
    const confirmTime = this.dateService.generateOtpTime();
    const confirmString = randomstring.generate(15);
    const confirmModel = new ConfirmMail({
      email: email,
      confirmString: confirmString,
      expireDate: confirmTime,
      createDate: new Date(Date.now()),
    });
    const oldConfirmMail = await this.conformRepository.findOne(email);
    if (oldConfirmMail) {
      await this.conformRepository.removeOne(email);
    }
    const confirmMail = await this.conformRepository.create(confirmModel);
    return await this.mailService.send(
      email,
      subject,
      'Ваш проверочный код: ' + confirmMail.confirmString,
    );
  }
}
