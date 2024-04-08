import { Provider } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { IBcrypt } from '../../../common/interfaces/bcrypt.interface';

export const BcryptProvider: Provider = {
  provide: IBcrypt,
  useClass: BcryptService,
};
