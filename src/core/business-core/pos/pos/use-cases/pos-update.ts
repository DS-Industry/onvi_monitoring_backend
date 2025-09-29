import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { IAddressRepository } from '@business-core/address/interfaces/address';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { PosUpdateDto } from '@platform-user/core-controller/dto/receive/pos-update.dto';
import { Address } from '@business-core/address/domain/address';
import { User } from '@platform-user/user/domain/user';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { IFileAdapter } from '@libs/file/adapter';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class UpdatePosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly addressRepository: IAddressRepository,
    private readonly carWashPosRepository: ICarWashPosRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    id: number,
    input: PosUpdateDto,
    user: User,
    pos: Pos,
    file?: Express.Multer.File,
  ): Promise<PosResponseDto> {
    
    if (!pos) {
      throw new Error('POS not found');
    }

    const posProps = pos.getProps();
    let addressId = posProps.addressId;
    if (input.address) {
      const addressData = new Address({
        city: input.address.city,
        location: input.address.location,
        lat: input?.address.lat,
        lon: input?.address.lon,
      });
      const address = await this.addressRepository.create(addressData);
      addressId = address.id;
    }

    posProps.name = input.name ? input.name : posProps.name;
    posProps.slug = input.name ? slugify(input.name, '_') : posProps.slug;
    posProps.startTime = input.startTime ? input.startTime : posProps.startTime;
    posProps.endTime = input.endTime ? input.endTime : posProps.endTime;
    posProps.organizationId = input.organizationId ? input.organizationId : posProps.organizationId;
    posProps.posMetaData = input.posMetaData !== undefined ? input.posMetaData : posProps.posMetaData;
    posProps.addressId = addressId;
    posProps.updatedAt = new Date(Date.now());
    posProps.updatedById = user.id;

    if (file) {
      if (posProps.image) {
        await this.fileService.delete(`pos/${posProps.name}/${posProps.image}`);
      }
      const key = uuid();
      posProps.image = key;
      const keyWay = 'pos/' + posProps.name + '/' + key;
      await this.fileService.upload(file, keyWay);
    }

    const updatedPos = await this.posRepository.update(pos);

    let carWashPos = await this.carWashPosRepository.findOneByPosId(id);
    if (input.carWashPosType || input.minSumOrder || input.maxSumOrder || input.stepSumOrder) {
      if (carWashPos) {
        carWashPos.carWashPosType = input.carWashPosType ? input.carWashPosType : carWashPos.carWashPosType;
        carWashPos.minSumOrder = input.minSumOrder ? input.minSumOrder : carWashPos.minSumOrder;
        carWashPos.maxSumOrder = input.maxSumOrder ? input.maxSumOrder : carWashPos.maxSumOrder;
        carWashPos.stepSumOrder = input.stepSumOrder ? input.stepSumOrder : carWashPos.stepSumOrder;
        
        carWashPos = await this.carWashPosRepository.update(carWashPos);
      }
    }

    const updatedPosProps = updatedPos.getProps();
    const address = await this.addressRepository.findOneById(updatedPosProps.addressId);

    return {
      id: updatedPosProps.id,
      name: updatedPosProps.name,
      slug: updatedPosProps.slug,
      startTime: updatedPosProps.startTime,
      endTime: updatedPosProps.endTime,
      organizationId: updatedPosProps.organizationId,
      posMetaData: updatedPosProps.posMetaData,
      timezone: updatedPosProps.timezone,
      image: updatedPosProps.image,
      rating: updatedPosProps.rating,
      status: updatedPosProps.status,
      createdAt: updatedPosProps.createdAt,
      updatedAt: updatedPosProps.updatedAt,
      createdById: updatedPosProps.createdById,
      updatedById: updatedPosProps.updatedById,
      address: {
        id: address.id,
        city: address.city,
        location: address.location,
        lat: address.lat,
        lon: address.lon,
      },
      posType: {
        id: carWashPos.id,
        name: carWashPos.name,
        slug: carWashPos.slug,
        carWashPosType: carWashPos.carWashPosType,
        minSumOrder: carWashPos.minSumOrder,
        maxSumOrder: carWashPos.maxSumOrder,
        stepSumOrder: carWashPos.stepSumOrder,
      },
    };
  }
}
