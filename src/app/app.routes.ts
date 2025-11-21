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
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Inicio - Bolsa de Trabajo'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Registrarse'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard'
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./pages/ofertas-list/ofertas-list.component').then(m => m.OfertasListComponent),
    title: 'Ofertas Laborales'
  },
  {
    path: 'ofertas/:id',
    loadComponent: () => import('./pages/oferta-detail/oferta-detail.component').then(m => m.OfertaDetailComponent),
    title: 'Detalle de Oferta'
  },
  {
    path: 'ofertas-form',
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent),
    canActivate: [authGuard],
    title: 'Nueva Oferta'
  },
  {
    path: 'ofertas-form/:id',
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent),
    canActivate: [authGuard],
    title: 'Editar Oferta'
  },
  {
    path: 'empresas',
    loadComponent: () => import('./pages/empresas-list/empresas-list.component').then(m => m.EmpresasListComponent),
    title: 'Empresas'
  },
  {
    path: 'empresas/:id',
    loadComponent: () => import('./pages/empresa-detail/empresa-detail.component').then(m => m.EmpresaDetailComponent),
    title: 'Detalle de Empresa'
  },
  {
    path: 'empresas-form',
    loadComponent: () => import('./pages/empresa-form/empresa-form.component').then(m => m.EmpresaFormComponent),
    canActivate: [authGuard],
    title: 'Nueva Empresa'
  },
  {
    path: 'empresas-form/:id',
    loadComponent: () => import('./pages/empresa-form/empresa-form.component').then(m => m.EmpresaFormComponent),
    canActivate: [authGuard],
    title: 'Editar Empresa'
  },
  {
    path: 'mis-postulaciones',
    loadComponent: () => import('./pages/postulaciones/postulaciones.component').then(m => m.PostulacionesComponent),
    canActivate: [authGuard],
    title: 'Mis Postulaciones'
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent),
    canActivate: [authGuard],
    title: 'Estadísticas'
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página No Encontrada'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];