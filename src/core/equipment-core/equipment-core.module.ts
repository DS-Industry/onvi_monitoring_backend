import { Module } from '@nestjs/common';
import { TechTaskModule } from './techTask/tech-task.module';

@Module({
  imports: [TechTaskModule],
  exports: [TechTaskModule],
})
export class EquipmentCoreModule {}
