import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take, switchMap } from 'rxjs/operators';
import { user } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const firestore = inject(Firestore);

  const requiredRole = route.data?.['role'] || 'admin'; // Default to admin if no role specified

  return user(auth).pipe(
    take(1),
    switchMap(currentUser => {
      if (!currentUser) {
        console.log('Usuario no autenticado, redirigiendo a login');
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: state.url
          }
        });
        return of(false);
      }

      // Get user data from Firestore
      const userDoc = doc(firestore, `usuarios/${currentUser.uid}`);
      return docData(userDoc).pipe(
        take(1),
        map((userData: any) => {
          if (!userData) {
            console.log('No se encontraron datos del usuario');
            router.navigate(['/login']);
            return false;
          }

          if (userData.rol === requiredRole) {
            console.log(`Acceso permitido para rol: ${userData.rol}`);
            return true;
          } else {
            console.log(`Acceso denegado. Rol requerido: ${requiredRole}, Rol actual: ${userData.rol}`);
            router.navigate(['/dashboard']); // Redirect to dashboard if not authorized
            return false;
          }
        })
      );
    })
  );
};
