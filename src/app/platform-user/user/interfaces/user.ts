import { User } from '@platform-user/user/domain/user';

export abstract class IUserRepository {
  abstract create(input: User): Promise<User>;
  abstract createMany(input: User[]): Promise<User[]>;
  abstract findOneById(id: number): Promise<User>;
  abstract findOneByEmail(email: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: number, input: User): Promise<User>;
  abstract remove(id: number): Promise<any>;
}
