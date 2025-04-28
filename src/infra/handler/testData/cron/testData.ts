import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DeviceOperationHandlerUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-handler';
import { DeviceProgramHandlerUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-handler';
import { CreateDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-create';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';

@Injectable()
export class TestDataCron {
  constructor(
    private readonly deviceOperationHandlerUseCase: DeviceOperationHandlerUseCase,
    private readonly deviceProgramHandlerUseCase: DeviceProgramHandlerUseCase,
    private readonly createDeviceEventUseCase: CreateDeviceEventUseCase,
  ) {}

  @Cron('0 6 * * *')
  async execute(): Promise<void> {
    console.log('start dataTest');
    await this.createOperationsForDevice(9991, [10, 50, 100, 150, 200], 20);
    await this.createOperationsForDevice(9992, [10, 50, 100, 150, 200], 20);
    await this.createOperationsForDevice(9994, [350, 500, 600], 20);

    await this.createProgramsForDevice(9991, [11, 12, 13, 14, 15, 16, 17], 20);
    await this.createProgramsForDevice(9992, [11, 12, 13, 14, 15, 16, 17], 20);
    await this.createProgramsForDevice(9994, [18, 19, 113], 20);

    await this.createDeviceEvents();
    console.log('end dataTest');
  }

  private async createOperationsForDevice(
    deviceId: number,
    dataValues: number[],
    count: number,
  ): Promise<void> {
    const operValues = [1, 2, 23, 25];
    const status = 1;

    for (let i = 0; i < count; i++) {
      const oper = this.getRandomValue(operValues);
      const data = this.getRandomValue(dataValues);
      const counter = this.getRandomInt(1000, 10000);
      const localId = this.getRandomInt(1000, 10000);

      const { begDate, endDate } = this.generateRandomDatePair();

      const operationData: DeviceDataRawHandlerResponse = {
        oper,
        status,
        data,
        counter,
        localId,
        begDate,
        endDate,
        deviceId,
      };

      await this.deviceOperationHandlerUseCase.execute(operationData);
    }
  }

  private async createProgramsForDevice(
    deviceId: number,
    dataValues: number[],
    count: number,
  ): Promise<void> {
    const oper = 1;
    const status = 1;

    for (let i = 0; i < count; i++) {
      const data = this.getRandomValue(dataValues);
      const counter = this.getRandomInt(1000, 10000);
      const localId = this.getRandomInt(1000, 10000);

      const { begDate, endDate } = this.generateRandomProgramDatePair();

      const programData: DeviceDataRawHandlerResponse = {
        oper,
        status,
        data,
        counter,
        localId,
        begDate,
        endDate,
        deviceId,
      };

      await this.deviceProgramHandlerUseCase.execute(programData);
    }
  }

  private getRandomValue<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateRandomDatePair(): { begDate: Date; endDate: Date } {
    const today = new Date();
    const begDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.getRandomInt(0, 23),
      this.getRandomInt(0, 59),
      this.getRandomInt(0, 59),
    );

    const endDate = new Date(begDate.getTime());
    endDate.setHours(endDate.getHours() + this.getRandomInt(0, 5));
    endDate.setMinutes(this.getRandomInt(0, 59));
    endDate.setSeconds(this.getRandomInt(0, 59));

    return { begDate, endDate };
  }

  private generateRandomProgramDatePair(): { begDate: Date; endDate: Date } {
    const today = new Date();
    const begDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.getRandomInt(0, 23),
      this.getRandomInt(0, 59),
      this.getRandomInt(0, 59),
    );

    const endDate = new Date(begDate.getTime());

    endDate.setMinutes(endDate.getMinutes() + this.getRandomInt(5, 15));

    return { begDate, endDate };
  }

  private async createDeviceEvents(): Promise<void> {
    const deviceIds = [9991, 9992, 9994];
    const eventTypeId = 9;

    for (const deviceId of deviceIds) {
      const eventDate = this.generateRandomTimeBetween(8, 10);

      await this.createDeviceEventUseCase.execute(
        deviceId,
        eventTypeId,
        eventDate,
      );
    }
  }

  private generateRandomTimeBetween(startHour: number, endHour: number): Date {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      this.getRandomInt(startHour, endHour - 1),
      this.getRandomInt(0, 59),
      this.getRandomInt(0, 59),
    );
  }
}
