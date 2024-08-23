import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CarWashDevice } from '../domain/car-wash-device';
import { ICarWashDeviceRepository } from '../interfaces/car-wash-device';
import { PrismaCarWashDeviceMapper } from '@db/mapper/prisma-car-wash-device-mapper';

@Injectable()
export class CarWashDeviceRepository extends ICarWashDeviceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CarWashDevice): Promise<CarWashDevice> {
    const carWashDevicePrismaEntity = PrismaCarWashDeviceMapper.toPrisma(input);
    const carWashDevice = await this.prisma.carWashDevice.create({
      data: carWashDevicePrismaEntity,
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }

  async update(id: number, input: CarWashDevice): Promise<CarWashDevice> {
    const carWashDevicePrismaEntity = PrismaCarWashDeviceMapper.toPrisma(input);
    const carWashDevice = await this.prisma.carWashDevice.update({
      where: { id },
      data: carWashDevicePrismaEntity,
    });
    return PrismaCarWashDeviceMapper.toDomain(carWashDevice);
  }

  async findOneById(id: number): Promise<CarWashDevice> {
    const carWashDevice = await this.prisma.carWashDevice.findFirst({
      where: { id },
    });
    return carWashDevice
      ? PrismaCarWashDeviceMapper.toDomain(carWashDevice)
      : null;
  }

  async findAll(): Promise<CarWashDevice[]> {
    const carWashDevices = await this.prisma.carWashDevice.findMany();
    return carWashDevices.map((item) =>
      PrismaCarWashDeviceMapper.toDomain(item),
    );
  }
}
