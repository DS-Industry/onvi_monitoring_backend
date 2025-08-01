import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IGradingEstimationRepository } from '@finance/shiftReport/gradingEstimation/interface/gradingEstimation';
import { GradingEstimation } from '@finance/shiftReport/gradingEstimation/domain/gradingEstimation';
import { PrismaGradingEstimationMapper } from '@db/mapper/prisma-grading-estimation-mapper';

@Injectable()
export class GradingEstimationRepository extends IGradingEstimationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: GradingEstimation): Promise<GradingEstimation> {
    const gradingEstimationEntity =
      PrismaGradingEstimationMapper.toPrisma(input);
    const gradingEstimation = await this.prisma.mNGGradingEstimation.create({
      data: gradingEstimationEntity,
    });
    return PrismaGradingEstimationMapper.toDomain(gradingEstimation);
  }

  public async findOneById(id: number): Promise<GradingEstimation> {
    const gradingEstimation = await this.prisma.mNGGradingEstimation.findFirst({
      where: { id },
    });
    return PrismaGradingEstimationMapper.toDomain(gradingEstimation);
  }

  public async findAll(): Promise<GradingEstimation[]> {
    const gradingEstimations =
      await this.prisma.mNGGradingEstimation.findMany();

    return gradingEstimations.map((item) =>
      PrismaGradingEstimationMapper.toDomain(item),
    );
  }

  public async update(input: GradingEstimation): Promise<GradingEstimation> {
    const gradingEstimationEntity =
      PrismaGradingEstimationMapper.toPrisma(input);
    const gradingEstimation = await this.prisma.mNGGradingEstimation.update({
      where: { id: gradingEstimationEntity.id },
      data: gradingEstimationEntity,
    });
    return PrismaGradingEstimationMapper.toDomain(gradingEstimation);
  }
}
