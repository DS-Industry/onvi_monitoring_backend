import { Inject, Injectable } from '@nestjs/common';
import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';

import Multitenancy from 'supertokens-node/recipe/multitenancy';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [Multitenancy.init({}), Session.init()],
    });
  }
}
