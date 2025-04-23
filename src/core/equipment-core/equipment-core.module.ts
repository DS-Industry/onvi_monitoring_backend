import { Module } from '@nestjs/common';
import { TechTaskModule } from './techTask/tech-task.module';
import { EquipmentModule } from '@equipment/equipment.module';

@Module({
  imports: [TechTaskModule, EquipmentModule],
  exports: [TechTaskModule, EquipmentModule],
})
export class EquipmentCoreModule {}
