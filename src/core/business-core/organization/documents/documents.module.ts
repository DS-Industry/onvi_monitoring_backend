import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DocumentsRepositoryProvider } from './provider/documents';
import { CreateDocumentUseCase } from './use-cases/document-create';
import { FileModule } from '@libs/file/module';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [DocumentsRepositoryProvider, CreateDocumentUseCase],
  exports: [CreateDocumentUseCase],
})
export class DocumentsModule {}
