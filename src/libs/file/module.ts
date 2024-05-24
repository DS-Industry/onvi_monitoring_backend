import { Module } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { FileService } from '@libs/file/service';

@Module({
  imports: [],
  providers: [
    {
      provide: IFileAdapter,
      useClass: FileService,
    },
  ],
  exports: [IFileAdapter],
})
export class FileModule {}
