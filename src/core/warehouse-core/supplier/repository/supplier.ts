import { Injectable } from '@nestjs/common';
import { ISupplierRepository } from '@warehouse/supplier/interface/supplier';
import { PrismaService } from '@db/prisma/prisma.service';
import { Supplier } from '@warehouse/supplier/domain/supplier';
import { PrismaSupplierMapper } from '@db/mapper/prisma-supplier-mapper';

@Injectable()
export class SupplierRepository extends ISupplierRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Supplier): Promise<Supplier> {
    const supplierEntity = PrismaSupplierMapper.toPrisma(input);
    const supplier = await this.prisma.supplier.create({
      data: supplierEntity,
    });
    return PrismaSupplierMapper.toDomain(supplier);
  }

  public async findOneById(id: number): Promise<Supplier> {
    const supplier = await this.prisma.supplier.findFirst({
      where: {
        id,
      },
    });
    return PrismaSupplierMapper.toDomain(supplier);
  }

  public async findAll(
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<Supplier[]> {
    const suppliers = await this.prisma.supplier.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        name,
      },
      orderBy: {
        id: 'asc',
      },
    });
    return suppliers.map((item) => PrismaSupplierMapper.toDomain(item));
  }

  public async countAll(name?: string): Promise<number> {
    return this.prisma.supplier.count({ where: { name } });
  }

  public async update(input: Supplier): Promise<Supplier> {
    const supplierEntity = PrismaSupplierMapper.toPrisma(input);
    const supplier = await this.prisma.supplier.update({
      where: {
        id: input.id,
      },
      data: supplierEntity,
    });
    return PrismaSupplierMapper.toDomain(supplier);
  }
}
