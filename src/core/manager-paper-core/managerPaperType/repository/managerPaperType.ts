import { Injectable } from '@nestjs/common';
import { IManagerPaperTypeRepository } from '@manager-paper/managerPaperType/interface/managerPaperType';
import { PrismaService } from '@db/prisma/prisma.service';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';
import { PrismaManagerPaperTypeMapper } from '@db/mapper/prisma-manager-paper-type-mapper';

@Injectable()
export class ManagerPaperTypeRepository extends IManagerPaperTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ManagerPaperType): Promise<ManagerPaperType> {
    const managerPaperTypePrismaEntity =
      PrismaManagerPaperTypeMapper.toPrisma(input);
    const managerPaperType = await this.prisma.managerPaperType.create({
      data: managerPaperTypePrismaEntity,
    });
    return PrismaManagerPaperTypeMapper.toDomain(managerPaperType);
  }

  public async findOneById(id: number): Promise<ManagerPaperType> {
    const managerPaperType = await this.prisma.managerPaperType.findFirst({
      where: {
        id,
      },
    });
    return PrismaManagerPaperTypeMapper.toDomain(managerPaperType);
  }

  public async findOneByName(name: string): Promise<ManagerPaperType> {
    const managerPaperType = await this.prisma.managerPaperType.findFirst({
      where: {
        name,
      },
    });
    return PrismaManagerPaperTypeMapper.toDomain(managerPaperType);
  }

  public async findAll(): Promise<ManagerPaperType[]> {
    const managerPaperTypes = await this.prisma.managerPaperType.findMany();
    return managerPaperTypes.map((item) =>
      PrismaManagerPaperTypeMapper.toDomain(item),
    );
  }

  public async update(input: ManagerPaperType): Promise<ManagerPaperType> {
    const managerPaperTypePrismaEntity =
      PrismaManagerPaperTypeMapper.toPrisma(input);
    const managerPaperType = await this.prisma.managerPaperType.update({
      where: {
        id: input.id,
      },
      data: managerPaperTypePrismaEntity,
    });
    return PrismaManagerPaperTypeMapper.toDomain(managerPaperType);
  }
}
