export interface IBaseRepositoryInterface<T> {
  create(date: any): Promise<T>;
  createMany(date: any): Promise<T[]>;
  findOneById(id: any): Promise<T>;
  findAll(options: any): Promise<T[]>;
  update(data: any): Promise<T>;
  remove(id: any): Promise<T>;
}
