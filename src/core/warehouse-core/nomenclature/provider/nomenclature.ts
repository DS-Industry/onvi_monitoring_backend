import { Provider } from '@nestjs/common';
import { NomenclatureRepository } from "@warehouse/nomenclature/repository/nomenclature";
import { INomenclatureRepository } from "@warehouse/nomenclature/interface/nomenclature";


export const NomenclatureRepositoryProvider: Provider = {
  provide: INomenclatureRepository,
  useClass: NomenclatureRepository,
};
