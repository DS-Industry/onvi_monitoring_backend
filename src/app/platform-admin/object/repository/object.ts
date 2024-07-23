import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ObjectPermissions } from '@platform-admin/object/domain/object';
import { PrismaObjectMapper } from '@db/mapper/prisma-object-mapper';
import { IObjectPermissionsRepository } from '@platform-admin/object/interfaces/object';

@Injectable()
export class ObjectRepository extends IObjectPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOneById(id: number): Promise<ObjectPermissions> {
    const object = await this.prisma.platformUserObjects.findFirst({
      where: {
        id,
      },
    });
    return PrismaObjectMapper.toDomain(object);
  }
}
