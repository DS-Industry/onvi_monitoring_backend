import { Injectable } from '@nestjs/common';
import { IDeviceDataRawRepository } from '@device/device-data-raw/interface/device-data-raw';
import { DeviceDataRaw } from '@device/device-data-raw/domain/device-data-raw';
import { LEN_DEVICE_DATA_RAW } from '@constant/constants';
import { StatusDeviceDataRaw } from '@prisma/client';

@Injectable()
export class HandlerDeviceDataRawUseCase {
  constructor(
    private readonly deviceDataRawRepository: IDeviceDataRawRepository,
  ) {}

  async execute(input: DeviceDataRaw): Promise<void> {
    const data = input.data;
    const clearData = data.trim().replace(/\s/g, '').replace(/\n/g, '');

    const data_len = clearData.length;
    let countRow = 0;
    let countErr = 0;
    let count = 0;
    let err = '';

    if (data_len % LEN_DEVICE_DATA_RAW === 0) {
      while (count < data_len) {
        countRow += 1;
        try {
          const onceRow = clearData.substring(
            count,
            count + LEN_DEVICE_DATA_RAW,
          );
          const data = this.parseStr(onceRow);
          console.log(data);
        } catch (error) {
          countErr += 1;
          err += `${countRow}: ${error.message}; `;
        }
        count += LEN_DEVICE_DATA_RAW;
      }
    } else {
      err = 'Неверная длинна данных, не кратная ' + LEN_DEVICE_DATA_RAW;
      countErr = 1;
    }

    input.errors = err;
    input.countRow = countRow;
    input.countError = countErr;
    input.status = StatusDeviceDataRaw.DONE;
    input.updatedAt = new Date(Date.now());

    await this.deviceDataRawRepository.update(input);
  }

  private reverseHex(hex: string): string {
    let reversedHex = '';
    for (let i = hex.length - 2; i >= 0; i -= 2) {
      reversedHex += hex.substring(i, i + 2);
    }
    return reversedHex;
  }

  private hex2dec(hex: string): number {
    return parseInt(hex, 16);
  }

  private hex2date(hex: string): Date {
    const decimal = this.hex2dec(hex);
    return this.addSecondsToDate('01.01.1970 00:00', decimal);
  }

  private addSecondsToDate(dateString: string, seconds: number): Date {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes); // Месяц начинается с 0
    return new Date(date.getTime() + seconds * 1000);
  }

  private parseStr(hex: string): any {
    const oper = this.hex2dec(this.reverseHex(hex.substring(0, 2)));
    const status = this.hex2dec(this.reverseHex(hex.substring(2, 4)));
    const data = this.hex2dec(this.reverseHex(hex.substring(4, 8)));
    const counter = this.hex2dec(this.reverseHex(hex.substring(8, 16)));
    const local_id = this.hex2dec(this.reverseHex(hex.substring(16, 24)));
    const beg_date = this.hex2date(this.reverseHex(hex.substring(24, 32)));
    const end_date = this.hex2date(this.reverseHex(hex.substring(32, 40)));
    const device_id = this.hex2dec(this.reverseHex(hex.substring(40, 44)));
    return {
      oper: oper,
      status: status,
      data: data,
      counter: counter,
      local_id: local_id,
      beg_date: beg_date,
      end_date: end_date,
      device_id: device_id,
    };
  }
}
