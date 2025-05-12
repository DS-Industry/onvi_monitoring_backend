import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IOrganizationConfirmMailRepository } from '../interfaces/confirmMail';
import { OrganizationConfirmMail } from '../domain/confirmMail';
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

  public async findOneByConfirmString(
    confirmString: string,
  ): Promise<OrganizationConfirmMail> {
    const confirmMail = await this.prisma.organizationMailConfirm.findFirst({
      where: {
        confirmString,
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

  public async update(
    input: OrganizationConfirmMail,
  ): Promise<OrganizationConfirmMail> {
    const confirmMailEntity =
      PrismaOrganizationMailConfirmMapper.toPrisma(input);
    const confirmMail = await this.prisma.organizationMailConfirm.update({
      where: {
        id: input.id,
      },
      data: confirmMailEntity,
    });
    return PrismaOrganizationMailConfirmMapper.toDomain(confirmMail);
  }
}
