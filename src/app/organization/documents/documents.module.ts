import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DocumentsRepositoryProvider } from '@organization/documents/provider/documents';
import { CreateDocumentUseCase } from '@organization/documents/use-cases/document-create';
import { FileModule } from '@libs/file/module';

@Module({
  imports: [PrismaModule, FileModule],
  providers: [DocumentsRepositoryProvider, CreateDocumentUseCase],
  exports: [CreateDocumentUseCase],
})
export class DocumentsModule {}
