import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { IFirebaseAdapter } from '@libs/firebase/adapter';

@Injectable()
export class FirebaseNotificationService
  implements IFirebaseAdapter, OnModuleInit
{
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const serviceAccountPath = this.configService.get<string>(
      'FIREBASE_ADMIN_KEY_PATH',
    );
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf8'),
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error('FCM Error:', error);
    }
  }

  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title,
        body,
      },
      data,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `Sent: ${response.successCount}, Failed: ${response.failureCount}`,
      );
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.warn(`Failed to send to ${tokens[idx]}:`, resp.error);
          }
        });
      }
    } catch (error) {
      console.error('FCM Multicast Error:', error);
    }
  }
}
