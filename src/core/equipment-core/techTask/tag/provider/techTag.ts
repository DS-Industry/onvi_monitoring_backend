import { Provider } from "@nestjs/common";
import { ITechTagRepository } from "@tech-task/tag/interface/techTag";
import { TechTagRepository } from "@tech-task/tag/repository/techTag";

export const TechTagRepositoryProvider: Provider = {
  provide: ITechTagRepository,
  useClass: TechTagRepository,
}