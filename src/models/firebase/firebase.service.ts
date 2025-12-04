import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';

import { EmisionAlerta } from './templates/EmisionAlerta';
import { SolicitudContacto } from './templates/SolicitudContacto';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      const credentials = this.loadCredentials();

      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });

      console.log("🔥 Firebase inicializado (archivo o env).");
    }
  }

  private loadCredentials(): admin.ServiceAccount {
    // Ruta del archivo local (desde la raíz del proyecto)
    const filePath = join(process.cwd(), 'src', 'models', 'firebase', 'firebase-credentials.json');

    // 1) Si existe el archivo → lo usamos
    if (existsSync(filePath)) {
      const fileData = readFileSync(filePath, 'utf8');
      return JSON.parse(fileData);
    }

    // 2) Si no existe → buscamos en env
    const rawEnv = process.env.FIREBASE_CREDENTIALS;

    if (!rawEnv) {
      throw new Error(
        '❌ No se encontró firebase-credentials.json ni la variable FIREBASE_CREDENTIALS.'
      );
    }

    try {
      return JSON.parse(rawEnv);
    } catch (e) {
      throw new Error('❌ FIREBASE_CREDENTIALS no es un JSON válido.');
    }
  }

  async sendNotification(token: string, title: string, body: string) {
    const message = {
      notification: { title, body },
      token,
      data: { alerta: "6", motivo: "A" }
    };
    return await admin.messaging().send(message);
  }

  async sendNotificationAlerta(token: string, data: any) {
    const notification: EmisionAlerta = new EmisionAlerta();
    const message = {
      notification: { ...notification },
      token,
      data: { ...data }
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error("Error sending notification:", error);
      console.error("message:", message);
    }
  }

  async sendNotificationSolicitudContacto(token: string, data: any) {
    const notification: SolicitudContacto = new SolicitudContacto();
    const message = {
      notification: { ...notification },
      token,
      data: { ...data }
    };

    try {
      await admin.messaging().send(message);
    } catch (error) {
      console.error("Error sending notification:", error);
      console.error("message:", message);
    }
  }
}
