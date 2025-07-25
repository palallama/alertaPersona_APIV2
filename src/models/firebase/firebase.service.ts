// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import * as serviceAccount from './firebase-credentials.json';
import serviceAccount from './firebase-credentials.json';
import { EmisionAlerta } from './templates/EmisionAlerta';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
    }
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
      data: {
        alerta: "6",
        motivo: "A"
      }
    };

    return await admin.messaging().send(message);
  }

  async sendNotificationAlerta(token:string, data:any) {

    const notificaction:EmisionAlerta = new EmisionAlerta();

    const message = {
      notification: {
        ...notificaction
      },
      token,
      data: {
        ...data
      }
    };
    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error("Error sending notification:", error);
      console.error("message:", message);
    }
  }
}
