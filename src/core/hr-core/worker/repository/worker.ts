import { Injectable } from '@nestjs/common';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { PrismaService } from '@db/prisma/prisma.service';
import { Worker } from '@hr/worker/domain/worker';
import { PrismaHrWorkerMapper } from '@db/mapper/prisma-hr-worker-mapper';
import { PaymentType, Prisma } from '@prisma/client';

@Injectable()
export class WorkerRepository extends IWorkerRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Worker): Promise<Worker> {
    const workerPrismaEntity = PrismaHrWorkerMapper.toPrisma(input);
    const worker = await this.prisma.hrWorker.create({
      data: workerPrismaEntity,
    });
    return PrismaHrWorkerMapper.toDomain(worker);
  }

  public async findOneById(id: number): Promise<Worker> {
    const worker = await this.prisma.hrWorker.findFirst({
      where: {
        id,
      },
    });
    return PrismaHrWorkerMapper.toDomain(worker);
  }

  public async findAllByIds(ids: number[]): Promise<Worker[]> {
    const workers = await this.prisma.hrWorker.findMany({
      where: { id: { in: ids } },
    });
    return workers.map((item) => PrismaHrWorkerMapper.toDomain(item));
  }

  public async findAllByPosId(posId: number): Promise<Worker[]> {
    const workers = await this.prisma.hrWorker.findMany({
      where: { posWorks: { some: { id: posId } } },
    });
    return workers.map((item) => PrismaHrWorkerMapper.toDomain(item));
  }

  public async findAllByFilter(
    placementId?: number,
    hrPositionId?: number,
    organizationId?: number,
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<Worker[]> {
    const where: any = {};

    if (placementId !== undefined) {
      where.placementId = placementId;
    }

    if (organizationId !== undefined) {
      where.organizationId = organizationId;
    }

    if (name !== undefined) {
      where.name = name;
    }

    if (hrPositionId !== undefined) {
      where.hrPositionId = hrPositionId;
    }

    const workers = await this.prisma.hrWorker.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        id: 'asc',
      },
    });
    return workers.map((item) => PrismaHrWorkerMapper.toDomain(item));
  }

  public async findAllForCalculatePayment(
    organizationId: number,
    billingMonth: Date,
    hrPositionId?: number,
    paymentType?: PaymentType,
  ): Promise<Worker[]> {
    const where: Prisma.HrWorkerWhereInput = {
      organizationId,
      hrPayment: {
        none: {
          billingMonth,
          ...(paymentType !== undefined && { paymentType }),
        },
      },
    };

    if (hrPositionId !== undefined) {
      where.hrPositionId = hrPositionId;
    }
    const workers = await this.prisma.hrWorker.findMany({
      where,
    });
    return workers.map((item) => PrismaHrWorkerMapper.toDomain(item));
  }

  public async update(input: Worker): Promise<Worker> {
    const workerPrismaEntity = PrismaHrWorkerMapper.toPrisma(input);
    const worker = await this.prisma.hrWorker.update({
      where: {
        id: input.id,
      },
      data: workerPrismaEntity,
    });
    return PrismaHrWorkerMapper.toDomain(worker);
  }
}
