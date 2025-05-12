import { Injectable } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-user/confirmMail/interfaces/confirmMail';
import { IDateAdapter } from '@libs/date/adapter';
import { IMailAdapter } from '@libs/mail/adapter';
import * as randomstring from 'randomstring';
import { ConfirmMail } from '@platform-user/confirmMail/domain/confirmMail';

@Injectable()
export class SendConfirmMailUseCase {
  constructor(
    private readonly confirmRepository: IConfirmMailRepository,
    private readonly dateService: IDateAdapter,
    private readonly mailService: IMailAdapter,
  ) {}

  async execute(email: string, subject: string): Promise<any> {
    const confirmTime = this.dateService.generateOtpTime();
    const confirmString = `${randomstring.generate({ charset: 'numeric', length: 3 })}-${randomstring.generate({ charset: 'numeric', length: 3 })}`;
    const confirmModel = new ConfirmMail({
      email: email,
      confirmString: confirmString,
      expireDate: confirmTime,
      createDate: new Date(Date.now()),
    });
    const oldConfirmMail = await this.confirmRepository.findOne(email);
    if (oldConfirmMail) {
      await this.confirmRepository.removeOne(email);
    }
    const confirmMail = await this.confirmRepository.create(confirmModel);
    return await this.mailService.send(
      email,
      subject,
      'Ваш проверочный код: ' + confirmMail.confirmString,
    );
  }
}
