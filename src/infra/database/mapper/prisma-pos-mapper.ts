import { Pos as PrismaPos, Prisma } from '@prisma/client';
import { Pos } from '@pos/pos/domain/pos';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { Address } from '@address/domain/address';
export type PrismaPosWithCarWashPosAndAddress = Prisma.PosGetPayload<{
  include: { carWashPos: true; address: true };
}>;
export type PrismaPosWithAddress = Prisma.PosGetPayload<{
  include: { address: true, carWashPos: true };
}>;
export class PrismaPosMapper {
  static toDomain(entity: PrismaPos | PrismaPosWithAddress): Pos {
    if (!entity) {
      return null;
    }
    const address =
      'address' in entity && entity.address
        ? new Address({
            id: entity.address.id,
            city: entity.address.city,
            location: entity.address.location,
            lat: entity.address.lat,
            lon: entity.address.lon,
          })
        : undefined;

    // Extract carWashPos properties if available
    const carWashPosType = 'carWashPos' in entity && entity.carWashPos ? entity.carWashPos.carWashPosType : undefined;
    const minSumOrder = 'carWashPos' in entity && entity.carWashPos ? entity.carWashPos.minSumOrder : undefined;
    const maxSumOrder = 'carWashPos' in entity && entity.carWashPos ? entity.carWashPos.maxSumOrder : undefined;
    const stepSumOrder = 'carWashPos' in entity && entity.carWashPos ? entity.carWashPos.stepSumOrder : undefined;

    return new Pos({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      startTime: (entity as any).startTime,
      endTime: (entity as any).endTime,
      organizationId: entity.organizationId,
      placementId: entity.placementId,
      posMetaData: entity.posMetaData,
      timezone: entity.timezone,
      addressId: entity.addressId,
      address: address,
      image: entity.image,
      rating: entity.rating,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
      carWashPosType: carWashPosType,
      minSumOrder: minSumOrder,
      maxSumOrder: maxSumOrder,
      stepSumOrder: stepSumOrder,      
    });
  }

  static toDomainFullData(
    entity: PrismaPosWithCarWashPosAndAddress,
  ): PosResponseDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      startTime: (entity as any).startTime,
      endTime: (entity as any).endTime,
      organizationId: entity.organizationId,
      placementId: entity.placementId,
      posMetaData: entity.posMetaData,
      timezone: entity.timezone,
      image: entity.image,
      rating: entity.rating,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
      address: {
        id: entity.address.id,
        city: entity.address.city,
        location: entity.address.location,
        lat: entity.address.lat,
        lon: entity.address.lon,
      },
      posType: {
        id: entity.carWashPos.id,
        name: entity.carWashPos.name,
        slug: entity.carWashPos.slug,
        carWashPosType: entity.carWashPos.carWashPosType,
        minSumOrder: entity.carWashPos.minSumOrder,
        maxSumOrder: entity.carWashPos.maxSumOrder,
        stepSumOrder: entity.carWashPos.stepSumOrder,
      },
    };
  }
  static toPrisma(pos: Pos): any {
    return {
      id: pos?.id,
      name: pos.name,
      slug: pos.slug,
      startTime: pos.startTime,
      endTime: pos.endTime,
      organizationId: pos.organizationId,
      placementId: pos.placementId,
      posMetaData: pos.posMetaData,
      timezone: pos.timezone,
      addressId: pos?.addressId,
      image: pos?.image,
      rating: pos?.rating,
      status: pos.status,
      createdAt: pos?.createdAt,
      updatedAt: pos?.updatedAt,
      createdById: pos.createdById,
      updateById: pos.updatedById,
    };
  }
}
