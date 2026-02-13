import { Provider } from "@nestjs/common";
import { ITechConsumablesRepository } from "@tech-report/techConsumables/interface/techConsumables";
import { TechConsumablesRepository } from "@tech-report/techConsumables/repository/techConsumables";

export const TechConsumablesRepositoryProvider: Provider = {
  provide: ITechConsumablesRepository,
  useClass: TechConsumablesRepository,
}