import { Injectable } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { PrismaService } from '@db/prisma/prisma.service';
import { PrismaCarWashPosMapper } from '@db/mapper/prisma-car-wash-pos-mapper';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

@Injectable()
export class CarWashPosRepository extends ICarWashPosRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CarWashPos): Promise<CarWashPos> {
    const carWashPosEntity = PrismaCarWashPosMapper.toPrisma(input);
    const carWashPos = await this.prisma.carWashPos.create({
      data: carWashPosEntity,
    });
    return PrismaCarWashPosMapper.toDomain(carWashPos);
  }

  public async findOneById(id: number): Promise<CarWashPos> {
    const carWashPos = await this.prisma.carWashPos.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashPosMapper.toDomain(carWashPos);
  }

  public async findOneByPosId(posId: number): Promise<CarWashPos> {
    const carWashPos = await this.prisma.carWashPos.findFirst({
      where: {
        posId,
      },
    });
    return PrismaCarWashPosMapper.toDomain(carWashPos);
  }

  public async update(input: CarWashPos): Promise<CarWashPos> {
    const carWashPosEntity = PrismaCarWashPosMapper.toPrisma(input);
    const carWashPos = await this.prisma.carWashPos.update({
      where: {
        id: input.id,
      },
      data: carWashPosEntity,
    });
    return PrismaCarWashPosMapper.toDomain(carWashPos);
  }
}
