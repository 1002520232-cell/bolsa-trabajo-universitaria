import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { user } from '@angular/fire/auth';

export const homeGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(currentUser => {
      if (currentUser) {
        // Usuario autenticado, redirigir al dashboard
        console.log('Usuario autenticado, redirigiendo al dashboard');
        router.navigate(['/dashboard']);
        return false;
      } else {
        // Usuario no autenticado, permitir acceso a home
        return true;
      }
    })
  );
};
