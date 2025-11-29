// src/app/core/services/auth.service.ts - CON LOGS PARA DEBUG
import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData, collection, collectionData } from '@angular/fire/firestore';
import { Observable, from, of, switchMap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser$ = user(this.auth);

  userData$: Observable<Usuario | null> = this.currentUser$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      const userDoc = doc(this.firestore, `usuarios/${user.uid}`);
      return docData(userDoc) as Observable<Usuario>;
    })
  );

  constructor() {
    console.log('🔐 AuthService inicializado');
    console.log('Auth objeto:', this.auth);
    console.log('Firestore objeto:', this.firestore);
  }

  // Registro de nuevo usuario
  register(email: string, password: string, nombre: string, apellido: string, rol: string, carrera?: string, empresaNombre?: string, empresaUbicacion?: string): Observable<any> {
    console.log('📝 Intentando registrar usuario:', { email, nombre, apellido, rol, carrera, empresaNombre, empresaUbicacion });

    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(credential => {
          console.log('✅ Usuario creado en Authentication:', credential.user.uid);

          const usuario: Usuario = {
            uid: credential.user.uid,
            email: email,
            nombre: nombre,
            apellido: apellido,
            rol: rol as 'estudiante' | 'empresa',
            createdAt: new Date(),
            updatedAt: new Date()
          };

          // Agregar campos específicos según el rol
          if (rol === 'estudiante' && carrera) {
            usuario.carrera = carrera;
          } else if (rol === 'empresa') {
            if (empresaNombre) usuario.empresaNombre = empresaNombre;
            if (empresaUbicacion) usuario.empresaUbicacion = empresaUbicacion;
          }

          console.log('📦 Guardando en Firestore:', usuario);

          const userDoc = doc(this.firestore, `usuarios/${credential.user.uid}`);
          return setDoc(userDoc, usuario)
            .then(() => {
              console.log('✅ Usuario guardado en Firestore exitosamente');
              return credential;
            })
            .catch(error => {
              console.error('❌ Error al guardar en Firestore:', error);
              throw error;
            });
        })
        .catch(error => {
          console.error('❌ Error en Authentication:', error);
          throw error;
        })
    );
  }

  // Login
  login(email: string, password: string): Observable<any> {
    console.log('🔑 Intentando login:', email);
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(credential => {
          console.log('✅ Login exitoso:', credential.user.uid);
          // Navegación removida para delegar a componente
          return credential;
        })
        .catch(error => {
          console.error('❌ Error en login:', error);
          throw error;
        })
    );
  }

  // Logout
  logout(): Observable<void> {
    console.log('👋 Cerrando sesión...');
    return from(signOut(this.auth).then(() => {
      console.log('✅ Sesión cerrada');
      // Navegación removida para delegar a componente
    }));
  }

  // Obtener datos del usuario actual
  async getCurrentUserData(): Promise<Usuario | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      console.log('⚠️ No hay usuario autenticado');
      return null;
    }

    console.log('📖 Obteniendo datos del usuario:', currentUser.uid);
    const userDoc = doc(this.firestore, `usuarios/${currentUser.uid}`);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      console.log('✅ Datos del usuario encontrados:', userSnap.data());
      return userSnap.data() as Usuario;
    } else {
      console.log('⚠️ No se encontraron datos en Firestore para:', currentUser.uid);
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const isAuth = this.auth.currentUser !== null;
    console.log('🔍 Usuario autenticado:', isAuth);
    return isAuth;
  }

  // Obtener UID del usuario actual
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Actualizar perfil de usuario
  async updateUserProfile(userId: string, data: Partial<Usuario>): Promise<void> {
    const userDoc = doc(this.firestore, `usuarios/${userId}`);
    await setDoc(userDoc, { ...data, updatedAt: new Date() }, { merge: true });
  }

  // Obtener todos los usuarios (solo para admin)
  getAllUsers(): Observable<Usuario[]> {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    return collectionData(usuariosCollection, { idField: 'uid' }) as Observable<Usuario[]>;
  }
}
