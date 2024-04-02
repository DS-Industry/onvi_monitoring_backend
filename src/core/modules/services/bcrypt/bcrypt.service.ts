import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IBcrypt } from '../../../common/interfaces/bcrypt.interface';

@Injectable()
export class BcryptService implements IBcrypt {
  rounds = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
