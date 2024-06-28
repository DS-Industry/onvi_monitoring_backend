import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IOrganizationConfirmMailRepository } from '@organization/confirmMail/interfaces/confirmMail';
import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';
import { PrismaOrganizationMailConfirmMapper } from '@db/mapper/prisma-organization-mail-confirm-mapper';

@Injectable()
export class OrganizationConfirmMailRepository extends IOrganizationConfirmMailRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: OrganizationConfirmMail,
  ): Promise<OrganizationConfirmMail> {
    const confirmMailEntity =
      PrismaOrganizationMailConfirmMapper.toPrisma(input);
    const confirmMail = await this.prisma.organizationMailConfirm.create({
      data: confirmMailEntity,
    });
    return PrismaOrganizationMailConfirmMapper.toDomain(confirmMail);
  }

  public async findOne(email: string): Promise<OrganizationConfirmMail> {
    const confirmMail = await this.prisma.organizationMailConfirm.findFirst({
      where: {
        email,
      },
    });
    return PrismaOrganizationMailConfirmMapper.toDomain(confirmMail);
  }

  public async removeOne(email: string): Promise<void> {
    await this.prisma.organizationMailConfirm.delete({
      where: {
        email,
      },
    });
  }
}
