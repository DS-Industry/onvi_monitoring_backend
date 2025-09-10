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
    file?: Express.Multer.File,
  ): Promise<PosResponseDto> {
    const existingPos = await this.posRepository.findOneById(id);
    
    if (!existingPos) {
      throw new Error('POS not found');
    }

    if (input.address) {
      const addressData = new Address({
        city: input.address.city,
        location: input.address.location,
        lat: input?.address.lat,
        lon: input?.address.lon,
      });
      const address = await this.addressRepository.create(addressData);
      existingPos.addressId = address.id;
    }

    existingPos.name = input.name ? input.name : existingPos.name;
    existingPos.slug = input.name ? slugify(input.name, '_') : existingPos.slug;
    existingPos.timeWork = input.timeWork ? input.timeWork : existingPos.timeWork;
    existingPos.organizationId = input.organizationId ? input.organizationId : existingPos.organizationId;
    existingPos.posMetaData = input.posMetaData !== undefined ? input.posMetaData : existingPos.posMetaData;
    existingPos.updatedAt = new Date(Date.now());
    existingPos.updatedById = user.id;

    if (file) {
      if (existingPos.image) {
        await this.fileService.delete(`pos/${existingPos.name}/${existingPos.image}`);
      }
      const key = uuid();
      existingPos.image = key;
      const keyWay = 'pos/' + existingPos.name + '/' + key;
      await this.fileService.upload(file, keyWay);
    }

    const updatedPos = await this.posRepository.update(existingPos);

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

    const address = await this.addressRepository.findOneById(updatedPos.addressId);

    return {
      id: updatedPos.id,
      name: updatedPos.name,
      slug: updatedPos.slug,
      timeWork: updatedPos.timeWork,
      organizationId: updatedPos.organizationId,
      posMetaData: updatedPos.posMetaData,
      timezone: updatedPos.timezone,
      image: updatedPos.image,
      rating: updatedPos.rating,
      status: updatedPos.status,
      createdAt: updatedPos.createdAt,
      updatedAt: updatedPos.updatedAt,
      createdById: updatedPos.createdById,
      updatedById: updatedPos.updatedById,
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
