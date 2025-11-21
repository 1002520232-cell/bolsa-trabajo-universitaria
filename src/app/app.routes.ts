// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./pages/ofertas-list/ofertas-list.component').then(m => m.OfertasListComponent)
  },
  {
    path: 'ofertas/:id',
    loadComponent: () => import('./pages/oferta-detail/oferta-detail.component').then(m => m.OfertaDetailComponent)
  },
  {
    path: 'ofertas-form',
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ofertas-form/:id',
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'empresas',
    loadComponent: () => import('./pages/empresas-list/empresas-list.component').then(m => m.EmpresasListComponent)
  },
  {
    path: 'empresas/:id',
    loadComponent: () => import('./pages/empresa-detail/empresa-detail.component').then(m => m.EmpresaDetailComponent)
  },
  {
    path: 'empresas-form',
    loadComponent: () => import('./pages/empresa-form/empresa-form.component').then(m => m.EmpresaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'empresas-form/:id',
    loadComponent: () => import('./pages/empresa-form/empresa-form.component').then(m => m.EmpresaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mis-postulaciones',
    loadComponent: () => import('./pages/postulaciones/postulaciones.component').then(m => m.PostulacionesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];