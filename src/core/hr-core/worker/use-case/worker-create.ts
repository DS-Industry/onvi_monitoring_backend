import { Injectable } from '@nestjs/common';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { CreateDto } from '@hr/worker/use-case/dto/create.dto';
import { Worker } from '@hr/worker/domain/worker';
import { IFileAdapter } from '@libs/file/adapter';
import { v4 as uuid } from 'uuid';
import { StatusHrWorker } from '@prisma/client';

@Injectable()
export class CreateWorkerUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(data: CreateDto, file?: Express.Multer.File): Promise<Worker> {
    const worker = new Worker({
      name: data.name,
      hrPositionId: data.hrPositionId,
      placementId: data.placementId,
      organizationId: data.organizationId,
      startWorkDate: data?.startWorkDate,
      phone: data?.phone,
      email: data?.email,
      description: data?.description,
      monthlySalary: data.monthlySalary || 0,
      dailySalary: data.dailySalary || 0,
      bonusPayout: data.bonusPayout || 0,
      status: StatusHrWorker.WORKS,
      gender: data?.gender,
      citizenship: data?.citizenship,
      passportSeries: data?.passportSeries,
      passportNumber: data?.passportNumber,
      passportExtradition: data?.passportExtradition,
      passportDateIssue: data?.passportDateIssue,
      inn: data?.inn,
      snils: data?.snils,
      registrationAddress: data?.registrationAddress,
    });

    if (file) {
      const key = uuid();
      worker.avatar = key;
      const keyWay = 'avatar/worker/' + key;
      await this.fileService.upload(file, keyWay);
    }
    return await this.workerRepository.create(worker);
  }
}
