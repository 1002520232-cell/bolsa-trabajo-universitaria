// src/app/app.config.ts - COMPATIBLE CON ANGULAR 18 + NODE 22
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Importar para configurar persistencia
import { browserLocalPersistence, browserSessionPersistence, setPersistence } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      // Configurar persistencia LOCAL para mantener sesión
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error('Error al configurar persistencia:', error);
      });
      return auth;
    }),
    provideFirestore(() => getFirestore())
  ]
};