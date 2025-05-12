import { Module } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { FileService } from '@libs/file/service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IFileAdapter,
      useClass: FileService,
    },
  ],
  exports: [IFileAdapter],
})
export class FileModule {}
