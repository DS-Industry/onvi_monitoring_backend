import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ICarWashDeviceRepository } from '@pos/device/device/interfaces/device';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { PrismaCarWashDeviceMapper } from '@db/mapper/prisma-car-wash-device-mapper';

@Injectable()
export class CarWashDeviceRepository extends ICarWashDeviceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CarWashDevice): Promise<CarWashDevice> {
    const carWashDeviceEntity = PrismaCarWashDeviceMapper.toPrisma(input);
    const carWashDevice = await this.prisma.carWashDevice.create({
      data: carWashDeviceEntity,
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }

  public async findOneById(id: number): Promise<CarWashDevice> {
    const carWashDevice = await this.prisma.carWashDevice.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }

  public async findAllByCWId(carWashPosId: number): Promise<CarWashDevice[]> {
    const carWashDevice = await this.prisma.carWashDevice.findMany({
      where: {
        carWashPosId,
      },
    });
    return carWashDevice.map((item) =>
      PrismaCarWashDeviceMapper.toDomain(item),
    );
  }

  public async findOneByNameAndCWId(
    carWashPosId: number,
    name: string,
  ): Promise<CarWashDevice> {
    const carWashDevice = await this.prisma.carWashDevice.findFirst({
      where: {
        carWashPosId,
        name,
      },
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }

  public async update(input: CarWashDevice): Promise<CarWashDevice> {
    const carWashDeviceEntity = PrismaCarWashDeviceMapper.toPrisma(input);
    const carWashDevice = await this.prisma.carWashDevice.update({
      where: {
        id: input.id,
      },
      data: carWashDeviceEntity,
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }
}
