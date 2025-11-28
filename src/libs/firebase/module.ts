import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IFirebaseAdapter } from '@libs/firebase/adapter';
import { FirebaseNotificationService } from '@libs/firebase/service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IFirebaseAdapter,
      useClass: FirebaseNotificationService,
    },
  ],
  exports: [IFirebaseAdapter],
})
export class FirebaseModule {}
