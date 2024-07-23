import { Injectable } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@device/deviceType/interfaces/deviceType';
import { PrismaService } from '@db/prisma/prisma.service';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';
import { PrismaCarWashDeviceTypeMapper } from '@db/mapper/prisma-car-wash-device-type-mapper';

@Injectable()
export class CarWashDeviceTypeRepository extends ICarWashDeviceTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CarWashDeviceType): Promise<CarWashDeviceType> {
    const carWashDeviceTypePrismaEntity =
      PrismaCarWashDeviceTypeMapper.toPrisma(input);
    const carWashDeviceType = await this.prisma.carWashDeviceType.create({
      data: carWashDeviceTypePrismaEntity,
    });
    return PrismaCarWashDeviceTypeMapper.toDomain(carWashDeviceType);
  }

  public async findAll(): Promise<CarWashDeviceType[]> {
    const carWashDeviceTypes = await this.prisma.carWashDeviceType.findMany();
    return carWashDeviceTypes.map((item) =>
      PrismaCarWashDeviceTypeMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<CarWashDeviceType> {
    const carWashDeviceType = await this.prisma.carWashDeviceType.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashDeviceTypeMapper.toDomain(carWashDeviceType);
  }

  public async findOneByName(name: string): Promise<CarWashDeviceType> {
    const carWashDeviceType = await this.prisma.carWashDeviceType.findFirst({
      where: {
        name,
      },
    });
    return PrismaCarWashDeviceTypeMapper.toDomain(carWashDeviceType);
  }

  public async findOneByCode(code: string): Promise<CarWashDeviceType> {
    const carWashDeviceType = await this.prisma.carWashDeviceType.findFirst({
      where: {
        code,
      },
    });
    return PrismaCarWashDeviceTypeMapper.toDomain(carWashDeviceType);
  }

  public async update(input: CarWashDeviceType): Promise<CarWashDeviceType> {
    const carWashDeviceTypePrismaEntity =
      PrismaCarWashDeviceTypeMapper.toPrisma(input);
    const carWashDeviceType = await this.prisma.carWashDeviceType.update({
      where: {
        id: input.id,
      },
      data: carWashDeviceTypePrismaEntity,
    });
    return PrismaCarWashDeviceTypeMapper.toDomain(carWashDeviceType);
  }
}
