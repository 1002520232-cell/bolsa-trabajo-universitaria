// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { Observable, from, of, switchMap, BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  
  // BehaviorSubject para trackear estado de autenticación
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();
  
  currentUser$ = user(this.auth);
  
  userData$: Observable<Usuario | null> = this.currentUser$.pipe(
    switchMap(user => {
      if (!user) {
        this.authStatusSubject.next(false);
        return of(null);
      }
      this.authStatusSubject.next(true);
      const userDoc = doc(this.firestore, `usuarios/${user.uid}`);
      return docData(userDoc) as Observable<Usuario>;
    })
  );

  constructor() {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
        this.authStatusSubject.next(true);
      } else {
        console.log('Usuario no autenticado');
        this.authStatusSubject.next(false);
      }
    });
  }

  // Registro de nuevo usuario
  register(email: string, password: string, nombre: string, apellido: string, carrera: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(credential => {
        const usuario: Usuario = {
          uid: credential.user.uid,
          email: email,
          nombre: nombre,
          apellido: apellido,
          carrera: carrera,
          rol: 'estudiante',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const userDoc = doc(this.firestore, `usuarios/${credential.user.uid}`);
        return setDoc(userDoc, usuario);
      })
    );
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Logout
  logout(): Observable<void> {
    return from(signOut(this.auth).then(() => {
      this.authStatusSubject.next(false);
      this.router.navigate(['/login']);
    }));
  }

  // Obtener datos del usuario actual
  async getCurrentUserData(): Promise<Usuario | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return null;
    
    const userDoc = doc(this.firestore, `usuarios/${currentUser.uid}`);
    const userSnap = await getDoc(userDoc);
    
    return userSnap.exists() ? userSnap.data() as Usuario : null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
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
}