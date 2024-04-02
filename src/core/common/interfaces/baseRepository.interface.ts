export interface IBaseRepositoryInterface<T> {
  create(params: { data: any }): Promise<T>;
  createMany(date: any): Promise<T[]>;
  findOneById(id: any): Promise<T>;
  findAll(): Promise<T[]>;
  update(data: any): Promise<T>;
  remove(id: any): Promise<T>;
}
