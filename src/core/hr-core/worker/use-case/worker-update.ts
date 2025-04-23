import { Injectable } from '@nestjs/common';
import { UpdateDto } from '@hr/worker/use-case/dto/update.dto';
import { Worker } from '@hr/worker/domain/worker';
import { IWorkerRepository } from '@hr/worker/interface/worker';
import { v4 as uuid } from 'uuid';
import { IFileAdapter } from '@libs/file/adapter';

@Injectable()
export class UpdateWorkerUseCase {
  constructor(
    private readonly workerRepository: IWorkerRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    input: UpdateDto,
    oldWorker: Worker,
    file?: Express.Multer.File,
  ): Promise<Worker> {
    const {
      hrPositionId,
      placementId,
      startWorkDate,
      phone,
      email,
      description,
      monthlySalary,
      dailySalary,
      percentageSalary,
      gender,
      citizenship,
      passportSeries,
      passportNumber,
      passportExtradition,
      passportDateIssue,
      inn,
      snils,
    } = input;

    oldWorker.hrPositionId = hrPositionId
      ? hrPositionId
      : oldWorker.hrPositionId;
    oldWorker.placementId = placementId ? placementId : oldWorker.placementId;
    oldWorker.startWorkDate = startWorkDate
      ? startWorkDate
      : oldWorker.startWorkDate;
    oldWorker.phone = phone ? phone : oldWorker.phone;
    oldWorker.email = email ? email : oldWorker.email;
    oldWorker.description = description ? description : oldWorker.description;
    oldWorker.monthlySalary = monthlySalary
      ? monthlySalary
      : oldWorker.monthlySalary;
    oldWorker.dailySalary = dailySalary ? dailySalary : oldWorker.dailySalary;
    oldWorker.percentageSalary = percentageSalary
      ? percentageSalary
      : oldWorker.percentageSalary;
    oldWorker.gender = gender ? gender : oldWorker.gender;
    oldWorker.citizenship = citizenship ? citizenship : oldWorker.citizenship;
    oldWorker.passportSeries = passportSeries
      ? passportSeries
      : oldWorker.passportSeries;
    oldWorker.passportNumber = passportNumber
      ? passportNumber
      : oldWorker.passportNumber;
    oldWorker.passportExtradition = passportExtradition
      ? passportExtradition
      : oldWorker.passportExtradition;
    oldWorker.passportDateIssue = passportDateIssue
      ? passportDateIssue
      : oldWorker.passportDateIssue;
    oldWorker.inn = inn ? inn : oldWorker.inn;
    oldWorker.snils = snils ? snils : oldWorker.snils;

    if (file) {
      if (oldWorker.avatar) {
        await this.fileService.delete('avatar/worker/' + oldWorker.avatar);
      }
      const key = uuid();
      oldWorker.avatar = key;
      const keyWay = 'avatar/worker/' + key;
      await this.fileService.upload(file, keyWay);
    }

    return await this.workerRepository.update(oldWorker);
  }
}
