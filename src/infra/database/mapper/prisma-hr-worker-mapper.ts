import { HrWorker as PrismaHrWorker, Prisma } from '@prisma/client';
import { Worker } from '@hr/worker/domain/worker';

export class PrismaHrWorkerMapper {
  static toDomain(entity: PrismaHrWorker): Worker {
    if (!entity) {
      return null;
    }
    return new Worker({
      id: entity.id,
      name: entity.name,
      hrPositionId: entity.hrPositionId,
      placementId: entity.placementId,
      organizationId: entity.organizationId,
      startWorkDate: entity.startWorkDate,
      phone: entity.phone,
      email: entity.email,
      description: entity.description,
      avatar: entity.avatar,
      monthlySalary: entity.monthlySalary,
      dailySalary: entity.dailySalary,
      percentageSalary: entity.percentageSalary,
      status: entity.status,
      gender: entity.gender,
      citizenship: entity.citizenship,
      passportSeries: entity.passportSeries,
      passportNumber: entity.passportNumber,
      passportExtradition: entity.passportExtradition,
      passportDateIssue: entity.passportDateIssue,
      inn: entity.inn,
      snils: entity.snils,
      registrationAddress: entity.registrationAddress,
    });
  }

  static toPrisma(worker: Worker): Prisma.HrWorkerUncheckedCreateInput {
    return {
      id: worker?.id,
      name: worker.name,
      hrPositionId: worker.hrPositionId,
      placementId: worker.placementId,
      organizationId: worker.organizationId,
      startWorkDate: worker?.startWorkDate,
      phone: worker?.phone,
      email: worker?.email,
      description: worker?.description,
      avatar: worker?.avatar,
      monthlySalary: worker.monthlySalary,
      dailySalary: worker.dailySalary,
      percentageSalary: worker.percentageSalary,
      status: worker.status,
      gender: worker?.gender,
      citizenship: worker?.citizenship,
      passportSeries: worker?.passportSeries,
      passportNumber: worker?.passportNumber,
      passportExtradition: worker?.passportExtradition,
      passportDateIssue: worker?.passportDateIssue,
      inn: worker?.inn,
      snils: worker?.snils,
      registrationAddress: worker?.registrationAddress,
    };
  }
}
