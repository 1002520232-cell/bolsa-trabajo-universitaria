// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { user } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(currentUser => {
      if (currentUser) {
        // Usuario autenticado, permitir acceso
        return true;
      } else {
        // Usuario no autenticado, redirigir a login con returnUrl
        console.log('Usuario no autenticado, redirigiendo a login');
        router.navigate(['/login'], { 
          queryParams: { 
            returnUrl: state.url 
          }
        });
        return false;
      }
    })
  );
};