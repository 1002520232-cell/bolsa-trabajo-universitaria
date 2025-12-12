import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { AuthService } from '../../core/services/auth.service';
import { PostulacionesService } from '../../core/services/postulaciones.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { Usuario } from '../../core/models/usuario.model';
import { Postulacion } from '../../core/models/postulacion.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';
import { EstadoPipe } from '../../shared/pipes/estado.pipe';

@Component({
  selector: 'app-mis-ofertas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CategoriaPipe, EstadoPipe],
  template: `
    <div class="container mt-4 mb-5">

      <!-- Company Profile Section -->
      <div class="row mb-4" *ngIf="user?.rol === 'empresa'">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-building me-2"></i>
                Información de la Empresa
              </h5>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h6 class="text-primary mb-2">{{ user?.empresaNombre || 'Nombre no especificado' }}</h6>
                  <p class="text-muted mb-1">
                    <i class="bi bi-person me-1"></i>
                    {{ user?.nombre }} {{ user?.apellido }}
                  </p>
                  <p class="text-muted mb-1" *ngIf="user?.empresaUbicacion">
                    <i class="bi bi-geo-alt me-1"></i>
                    {{ user?.empresaUbicacion }}
                  </p>
                  <p class="text-muted mb-0" *ngIf="user?.empresaSitioWeb">
                    <i class="bi bi-globe me-1"></i>
                    <a [href]="user?.empresaSitioWeb" target="_blank" class="text-decoration-none">
                      {{ user?.empresaSitioWeb }}
                    </a>
                  </p>
                </div>
                <div class="col-md-4 text-end">
                  <a href="#" (click)="openProfile($event)" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-pencil me-1"></i>
                    Editar Perfil
                  </a>
                </div>
              </div>
              <div class="mt-3" *ngIf="user?.empresaDescripcion">
                <p class="mb-0">{{ user?.empresaDescripcion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2><i class="bi bi-briefcase-fill"></i> Mis Ofertas Publicadas</h2>

            <a routerLink="/ofertas-form" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i> Nueva Oferta
            </a>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-primary">{{ ofertas.length }}</h4>
              <small class="text-muted">Total Ofertas</small>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-success">{{ ofertasActivas }}</h4>
              <small class="text-muted">Activas</small>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-info">{{ totalPostulaciones }}</h4>
              <small class="text-muted">Postulaciones Recibidas</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de ofertas -->
      <div *ngIf="!loading && ofertas.length > 0; else noOfertas">

        <div class="card shadow-sm mb-3" *ngFor="let oferta of ofertas">
          <div class="card-body">

            <div class="row align-items-center">
              <div class="col-md-8">

                <!-- Badges -->
                <div class="d-flex gap-2 mb-2">
                  <span class="badge bg-primary">
                    {{ oferta.categoria | categoria }}
                  </span>

                  <span class="badge"
                    [ngClass]="{
                      'bg-success': oferta.estado === 'activa',
                      'bg-danger': oferta.estado === 'cerrada',
                      'bg-warning': oferta.estado === 'pausada'
                    }">
                    {{ oferta.estado }}
                  </span>

                  <span class="badge bg-secondary">
                    {{ oferta.modalidad }}
                  </span>
                </div>

                <h5 class="mb-2">{{ oferta.titulo }}</h5>
                <h6 class="text-muted mb-3">
                  <i class="bi bi-building"></i> {{ oferta.empresaNombre }}
                </h6>

                <div class="small text-muted">
                  <span class="me-3">
                    <i class="bi bi-geo-alt"></i> {{ oferta.ubicacion }}
                  </span>

                  <span class="me-3">
                    <i class="bi bi-people"></i> {{ oferta.postulaciones }} postulaciones
                  </span>

                  <span>
                    <i class="bi bi-briefcase"></i> {{ oferta.vacantes }} vacantes
                  </span>
                </div>
              </div>

              <div class="col-md-4 text-end">
                <div class="d-flex flex-column gap-2">

                  <a [routerLink]="['/ofertas', oferta.id]" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-eye"></i> Ver Detalles
                  </a>

                  <a [routerLink]="['/ofertas-form', oferta.id]" class="btn btn-primary btn-sm">
                    <i class="bi bi-pencil"></i> Editar
                  </a>

                  <button *ngIf="oferta.estado !== 'cerrada'"
                    class="btn btn-outline-warning btn-sm"
                    (click)="toggleEstado(oferta)">
                    <i class="bi"
                      [ngClass]="oferta.estado === 'activa' ? 'bi-pause' : 'bi-play'"></i>
                    {{ oferta.estado === 'activa' ? 'Pausar' : 'Activar' }}
                  </button>

                  <button class="btn btn-outline-danger btn-sm" (click)="eliminarOferta(oferta)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>

                  <button *ngIf="(oferta.postulaciones ?? 0) > 0"
                    class="btn btn-outline-info btn-sm"
                    (click)="verPostulaciones(oferta)">
                    <i class="bi bi-people"></i> Gestionar Postulaciones
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Gestión de Postulaciones -->
      <div *ngIf="mostrarPostulaciones && ofertaSeleccionada" class="mt-5">
        <div class="card shadow-sm">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-people me-2"></i>
              Postulaciones para: {{ ofertaSeleccionada!.titulo }}
            </h5>
            <button class="btn btn-outline-secondary btn-sm" (click)="cerrarPostulaciones()">
              <i class="bi bi-x"></i> Cerrar
            </button>
          </div>

          <div class="card-body">
            <!-- Filtros -->
            <div class="row mb-4">
              <div class="col-md-6 mb-3">
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-search"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar en mensajes..."
                    [(ngModel)]="searchText"
                    (ngModelChange)="aplicarFiltros()">
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <select class="form-select" [(ngModel)]="filtroEstado" (change)="aplicarFiltros()">
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="revisada">En Revisión</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
            </div>

            <!-- Lista de postulaciones -->
            <div *ngIf="postulacionesFiltradas.length > 0; else noPostulaciones">
              <div class="card mb-3" *ngFor="let postulacion of postulacionesFiltradas">
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-md-8">
                      <div class="mb-2">
                        <span class="badge" [ngClass]="{
                          'bg-warning text-dark': postulacion.estado === 'pendiente',
                          'bg-info': postulacion.estado === 'revisada',
                          'bg-success': postulacion.estado === 'aceptada',
                          'bg-danger': postulacion.estado === 'rechazada'
                        }">
                          {{ postulacion.estado | estado }}
                        </span>
                      </div>

                      <p class="mb-2" *ngIf="postulacion.mensaje">
                        <strong>Mensaje:</strong> {{ postulacion.mensaje }}
                      </p>

                      <small class="text-muted d-block">
                        <i class="bi bi-calendar"></i>
                        Postulado el {{ getFechaPostulacion(postulacion) | date:'dd/MM/yyyy HH:mm' }}
                      </small>

                      <small class="text-muted d-block" *ngIf="postulacion.fechaRevision">
                        <i class="bi bi-eye"></i>
                        Revisado el {{ getFechaRevision(postulacion) | date:'dd/MM/yyyy HH:mm' }}
                      </small>

                      <div class="alert alert-info mt-3 mb-0" *ngIf="postulacion.notas">
                        <strong>Notas del reclutador:</strong><br>
                        {{ postulacion.notas }}
                      </div>
                    </div>

                    <div class="col-md-4 text-end">
                      <div class="d-flex flex-column gap-2">
                        <button
                          *ngIf="postulacion.estado === 'pendiente'"
                          class="btn btn-outline-primary btn-sm"
                          (click)="actualizarEstadoPostulacion(postulacion, 'revisada')">
                          <i class="bi bi-eye"></i> Marcar como Revisada
                        </button>

                        <button
                          *ngIf="postulacion.estado === 'revisada'"
                          class="btn btn-success btn-sm"
                          (click)="actualizarEstadoPostulacion(postulacion, 'aceptada')">
                          <i class="bi bi-check"></i> Aceptar
                        </button>

                        <button
                          *ngIf="postulacion.estado === 'revisada'"
                          class="btn btn-danger btn-sm"
                          (click)="actualizarEstadoPostulacion(postulacion, 'rechazada')">
                          <i class="bi bi-x"></i> Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #noPostulaciones>
              <div class="text-center py-5">
                <i class="bi bi-inbox display-1 text-muted"></i>
                <p class="lead text-muted mt-3">
                  {{ searchText || filtroEstado ? 'No se encontraron postulaciones' : 'No hay postulaciones para esta oferta' }}
                </p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- No ofertas -->
      <ng-template #noOfertas>
        <div class="text-center py-5" *ngIf="!loading">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="lead text-muted mt-3">No has publicado ofertas aún</p>
          <a routerLink="/ofertas-form" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Crear Mi Primera Oferta
          </a>
        </div>

        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary"></div>
          <p class="mt-3">Cargando ofertas...</p>
        </div>
      </ng-template>

    </div>
  `
})
export class MisOfertasComponent implements OnInit {

  private ofertasService = inject(OfertasService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private postulacionesService = inject(PostulacionesService);

  ofertas: OfertaLaboral[] = [];
  ofertasActivas = 0;
  totalPostulaciones = 0;
  loading = true;
  user: Usuario | null = null;

  // Gestión de postulaciones
  postulaciones: Postulacion[] = [];
  postulacionesFiltradas: Postulacion[] = [];
  ofertaSeleccionada: OfertaLaboral | null = null;
  mostrarPostulaciones = false;
  searchText = '';
  filtroEstado = '';

  get ofertaSeleccionadaNonNull(): OfertaLaboral {
    return this.ofertaSeleccionada!;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this.authService.getCurrentUserData();
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.cargarMisOfertas(userId);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  cargarMisOfertas(userId: string): void {
    this.loading = true;

    this.ofertasService.getOfertasByUser(userId).subscribe({
      next: (ofertas: OfertaLaboral[]) => {
        this.ofertas = ofertas;
        this.ofertasActivas = ofertas.filter((o: OfertaLaboral) => o.estado === 'activa').length;
        this.totalPostulaciones = ofertas.reduce((total, oferta) => total + (oferta.postulaciones || 0), 0);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar ofertas', err);
        this.loading = false;
      }
    });
  }

  async toggleEstado(oferta: OfertaLaboral): Promise<void> {
    const nuevoEstado = oferta.estado === 'activa' ? 'pausada' : 'activa';

    try {
      await this.ofertasService.updateOferta(oferta.id!, { estado: nuevoEstado });
      oferta.estado = nuevoEstado;
      alert(`Oferta ${nuevoEstado === 'activa' ? 'activada' : 'pausada'} exitosamente`);
    } catch {
      alert('Error al cambiar estado');
    }
  }

  async eliminarOferta(oferta: OfertaLaboral): Promise<void> {
    if (!confirm(`¿Eliminar "${oferta.titulo}"? Esta acción es irreversible.`)) return;

    try {
      await this.ofertasService.deleteOferta(oferta.id!);
      this.ofertas = this.ofertas.filter((o: OfertaLaboral) => o.id !== oferta.id);
      alert('Oferta eliminada');
    } catch {
      alert('Error al eliminar oferta');
    }
  }

  // Métodos para gestión de postulaciones
  verPostulaciones(oferta: OfertaLaboral): void {
    this.ofertaSeleccionada = oferta;
    this.mostrarPostulaciones = true;
    this.searchText = '';
    this.filtroEstado = '';

    this.postulacionesService.getPostulacionesByOferta(oferta.id!).subscribe({
      next: (postulaciones: Postulacion[]) => {
        this.postulaciones = postulaciones;
        this.aplicarFiltros();
      },
      error: (err: any) => {
        console.error('Error al cargar postulaciones', err);
        alert('Error al cargar postulaciones');
      }
    });
  }

  cerrarPostulaciones(): void {
    this.mostrarPostulaciones = false;
    this.ofertaSeleccionada = null;
    this.postulaciones = [];
    this.postulacionesFiltradas = [];
  }

  aplicarFiltros(): void {
    this.postulacionesFiltradas = this.postulaciones.filter(postulacion => {
      const matchesSearch = !this.searchText ||
        (postulacion.mensaje && postulacion.mensaje.toLowerCase().includes(this.searchText.toLowerCase()));

      const matchesEstado = !this.filtroEstado || postulacion.estado === this.filtroEstado;

      return matchesSearch && matchesEstado;
    });
  }

  getFechaPostulacion(postulacion: Postulacion): Date {
    return postulacion.fechaPostulacion instanceof Date ? postulacion.fechaPostulacion : new Date(postulacion.fechaPostulacion);
  }

  getFechaRevision(postulacion: Postulacion): Date {
    if (!postulacion.fechaRevision) return new Date();
    return postulacion.fechaRevision instanceof Date ? postulacion.fechaRevision : new Date(postulacion.fechaRevision);
  }

  async actualizarEstadoPostulacion(postulacion: Postulacion, nuevoEstado: Postulacion['estado']): Promise<void> {
    try {
      await this.postulacionesService.updateEstadoPostulacion(postulacion.id!, nuevoEstado).toPromise();
      postulacion.estado = nuevoEstado;
      postulacion.fechaRevision = new Date();
      this.aplicarFiltros();
      alert(`Postulación ${nuevoEstado} exitosamente`);
    } catch (error) {
      console.error('Error al actualizar estado', error);
      alert('Error al actualizar estado de la postulación');
    }
  }

  openProfile(event: Event) {
    event.preventDefault();
    const isAuth = this.authService.isAuthenticated();
    if (isAuth) {
      this.router.navigate(['/user-profile']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
