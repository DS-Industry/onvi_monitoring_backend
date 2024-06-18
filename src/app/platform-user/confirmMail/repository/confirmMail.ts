import { Injectable } from '@nestjs/common';
import { IConfirmMailRepository } from '@platform-user/confirmMail/interfaces/confirmMail';
import { PrismaService } from '@db/prisma/prisma.service';
import { ConfirmMail } from '@platform-user/confirmMail/domain/confirmMail';
import { PrismaPlatformUserMailConfirmMapper } from '@db/mapper/prisma-platform-user-mail-confirm-mapper';

@Injectable()
export class ConfirmMailRepository extends IConfirmMailRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ConfirmMail): Promise<ConfirmMail> {
    const confirmMailEntity =
      PrismaPlatformUserMailConfirmMapper.toPrisma(input);
    const confirmMail = await this.prisma.userMailConfirm.create({
      data: confirmMailEntity,
    });
    return PrismaPlatformUserMailConfirmMapper.toDomain(confirmMail);
  }

  public async findOne(email: string): Promise<ConfirmMail> {
    const confirmMail = await this.prisma.userMailConfirm.findFirst({
      where: {
        email,
      },
    });
    return PrismaPlatformUserMailConfirmMapper.toDomain(confirmMail);
  }

  public async removeOne(email: string): Promise<void> {
    await this.prisma.userMailConfirm.delete({
      where: {
        email,
      },
    });
  }
}
