// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage'; // ← NUEVO IMPORT
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => {
      console.log('🔥 Inicializando Firebase...');
      const app = initializeApp(environment.firebaseConfig);
      console.log('✅ Firebase inicializado correctamente');
      return app;
    }),
    provideAuth(() => {
      console.log('🔐 Inicializando Auth...');
      const auth = getAuth();
      console.log('✅ Auth inicializado');
      return auth;
    }),
    provideFirestore(() => {
      console.log('📦 Inicializando Firestore...');
      const firestore = getFirestore();
      console.log('✅ Firestore inicializado');
      return firestore;
    }),
    provideStorage(() => {  // ← NUEVO PROVIDER
      console.log('💾 Inicializando Storage...');
      const storage = getStorage();
      console.log('✅ Storage inicializado');
      return storage;
    })
  ]
};