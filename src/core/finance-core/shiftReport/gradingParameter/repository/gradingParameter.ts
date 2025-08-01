import { Injectable } from '@nestjs/common';
import { IGradingParameterRepository } from '@finance/shiftReport/gradingParameter/interface/gradingParameter';
import { PrismaService } from '@db/prisma/prisma.service';
import { GradingParameter } from '@finance/shiftReport/gradingParameter/domain/gradingParameter';
import { PrismaGradingParameterMapper } from '@db/mapper/prisma-grading-parameter-mapper';

@Injectable()
export class GradingParameterRepository extends IGradingParameterRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: GradingParameter): Promise<GradingParameter> {
    const gradingParameterEntity = PrismaGradingParameterMapper.toPrisma(input);
    const gradingParameter = await this.prisma.mNGGradingParameter.create({
      data: gradingParameterEntity,
    });
    return PrismaGradingParameterMapper.toDomain(gradingParameter);
  }

  public async findOneById(id: number): Promise<GradingParameter> {
    const gradingParameter = await this.prisma.mNGGradingParameter.findFirst({
      where: { id },
    });
    return PrismaGradingParameterMapper.toDomain(gradingParameter);
  }

  public async findAll(): Promise<GradingParameter[]> {
    const gradingParameters = await this.prisma.mNGGradingParameter.findMany();

    return gradingParameters.map((item) =>
      PrismaGradingParameterMapper.toDomain(item),
    );
  }

  public async update(input: GradingParameter): Promise<GradingParameter> {
    const gradingParameterEntity = PrismaGradingParameterMapper.toPrisma(input);
    const gradingParameter = await this.prisma.mNGGradingParameter.update({
      where: { id: gradingParameterEntity.id },
      data: gradingParameterEntity,
    });
    return PrismaGradingParameterMapper.toDomain(gradingParameter);
  }
}
