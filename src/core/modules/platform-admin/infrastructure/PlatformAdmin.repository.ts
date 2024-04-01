import { IBaseRepositoryInterface } from '../../../common/interfaces/baseRepository.interface';

export class PlatformAdminRepository implements IBaseRepositoryInterface<any> {
  async create(date: any): Promise<any> {
    return undefined;
  }

  async createMany(date: any): Promise<any[]> {
    return [];
  }

  async findAll(options: any): Promise<any[]> {
    return [];
  }

  async findOneById(id: any): Promise<any> {
    return undefined;
  }

  async remove(id: any): Promise<any> {
    return undefined;
  }

  async update(data: any): Promise<any> {
    return undefined;
  }
}
