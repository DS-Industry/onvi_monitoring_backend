import { Injectable } from '@nestjs/common';
import { IObjectPermissionsRepository } from '@platform-admin/object/interfaces/object';

@Injectable()
export class GetByIdObjectUseCase {
  constructor(
    private readonly objectRepository: IObjectPermissionsRepository,
  ) {}

  async execute(input: number) {
    const object = await this.objectRepository.findOneById(input);
    if (!object) {
      throw new Error('object not exists');
    }
    return object;
  }
}
