import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ObjectPermissions } from '../domain/object';
import { PrismaObjectMapper } from '@db/mapper/prisma-object-mapper'; //checl whether create new
import { IObjectPermissionsRepository } from '../interface/object';

@Injectable()
export class ObjectRepository extends IObjectPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOneById(id: number): Promise<ObjectPermissions> {
    const object = await this.prisma.objectPermissions.findFirst({
      where: {
        id,
      },
    });
    return PrismaObjectMapper.toDomain(object);
  }
}
