import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '@mobile-user/otp/interfaces/otp';
import { PrismaService } from '@db/prisma/prisma.service';
import { Otp } from '@mobile-user/otp/domain/otp';
import { PrismaOtpMapper } from '@db/mapper/prisma-otp-mapper';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(input: Otp): Promise<Otp> {
    const otpPrismaEntity = PrismaOtpMapper.toPrisma(input);
    const otp = await this.prisma.otp.create({
      data: otpPrismaEntity,
    });
    return PrismaOtpMapper.toDomain(otp);
  }

  public async findOne(phone: string): Promise<Otp> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        phone,
      },
    });
    return PrismaOtpMapper.toDomain(otp);
  }

  public async removeOne(phone: string): Promise<void> {
    await this.prisma.otp.delete({
      where: {
        phone,
      },
    });
  }
}
