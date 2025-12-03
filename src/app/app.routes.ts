// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
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
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
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
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent)
  },
  {
    path: 'ofertas-form/:id',
    loadComponent: () => import('./pages/oferta-form/oferta-form.component').then(m => m.OfertaFormComponent)
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
    loadComponent: () => import('./pages/postulaciones/postulaciones.component').then(m => m.PostulacionesComponent)
  },
  {
    path: 'estadisticas',
    loadComponent: () => import('./pages/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent),
    canActivate: [authGuard]
  },
  {
    path: 'videos-aprendizaje',
    loadComponent: () => import('./pages/videos-aprendizaje/videos-aprendizaje.component').then(m => m.VideosAprendizajeComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: 'mis-ofertas',
    loadComponent: () => import('./pages/mis-ofertas/mis-ofertas.component').then(m => m.MisOfertasComponent),
    title: 'Mis Ofertas'
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    title: 'Perfil de Usuario'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./pages/admin/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/empresas',
    loadComponent: () => import('./pages/admin/admin-empresas/admin-empresas.component').then(m => m.AdminEmpresasComponent),
    canActivate: [authGuard]
  }
];
