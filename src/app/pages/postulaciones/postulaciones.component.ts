// src/app/pages/postulaciones/postulaciones.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostulacionesService } from '../../core/services/postulaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { Postulacion } from '../../core/models/postulacion.model';
import { EstadoPipe } from '../../shared/pipes/estado.pipe';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, EstadoPipe],
  template: `
    <div class="container mt-4 mb-5">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-file-text"></i> Mis Postulaciones
          </h2>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por oferta o empresa..."
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

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-primary">{{ stats.totalPostulaciones }}</h4>
              <small class="text-muted">Total</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-warning">{{ stats.pendientes }}</h4>
              <small class="text-muted">Pendientes</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-success">{{ stats.aceptadas }}</h4>
              <small class="text-muted">Aceptadas</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h4 class="text-danger">{{ stats.rechazadas }}</h4>
              <small class="text-muted">Rechazadas</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de postulaciones -->
      <div class="row" *ngIf="!loading && postulacionesFiltradas.length > 0; else noResults">
        <div class="col-12">
          <div class="card shadow-sm mb-3" *ngFor="let postulacion of postulacionesFiltradas">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h5 class="mb-2">
                    <a [routerLink]="['/ofertas', postulacion.ofertaId]" class="text-decoration-none">
                      {{ postulacion.ofertaTitulo }}
                    </a>
                  </h5>
                  <h6 class="text-muted mb-3">
                    <i class="bi bi-building"></i> {{ postulacion.empresaNombre }}
                  </h6>
                  
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
                  <a [routerLink]="['/ofertas', postulacion.ofertaId]" class="btn btn-primary mb-2 w-100">
                    <i class="bi bi-eye"></i> Ver Oferta
                  </a>
                  <button 
                    class="btn btn-outline-danger w-100"
                    (click)="cancelarPostulacion(postulacion)"
                    *ngIf="postulacion.estado === 'pendiente'">
                    <i class="bi bi-x-circle"></i> Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="text-center py-5" *ngIf="!loading">
          <div class="mb-4">
            <i class="bi bi-inbox display-1 text-muted"></i>
          </div>
          <h4 class="text-muted mb-3">
            {{ searchText || filtroEstado ? 'No se encontraron postulaciones' : 'Aún no tienes postulaciones' }}
          </h4>
          <p class="text-muted mb-4" *ngIf="!(searchText || filtroEstado)">
            ¡Es hora de comenzar tu búsqueda de empleo! Explora las oportunidades disponibles y postula a las que más te interesen.
          </p>

          <!-- Consejos para postulantes -->
          <div class="tips-section mb-4" *ngIf="!(searchText || filtroEstado)">
            <h5 class="mb-3">💡 Consejos para postular</h5>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="tip-card">
                  <i class="bi bi-file-earmark-person"></i>
                  <h6>Prepara tu CV</h6>
                  <p>Asegúrate de que tu currículum esté actualizado y destaque tus habilidades.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="tip-card">
                  <i class="bi bi-chat-dots"></i>
                  <h6>Carta de presentación</h6>
                  <p>Escribe una carta personalizada explicando por qué eres el candidato ideal.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="tip-card">
                  <i class="bi bi-search"></i>
                  <h6>Investiga la empresa</h6>
                  <p>Conoce la cultura, valores y proyectos de la empresa antes de postular.</p>
                </div>
              </div>
            </div>
          </div>

          <a routerLink="/ofertas" class="btn btn-primary btn-lg">
            <i class="bi bi-search me-2"></i> Explorar Ofertas Disponibles
          </a>
        </div>
        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando postulaciones...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: []
})
export class PostulacionesComponent implements OnInit {
  private postulacionesService = inject(PostulacionesService);
  private authService = inject(AuthService);

  postulaciones: Postulacion[] = [];
  postulacionesFiltradas: Postulacion[] = [];
  searchText = '';
  filtroEstado = '';
  loading = true;
  stats = {
    totalPostulaciones: 0,
    pendientes: 0,
    revisadas: 0,
    aceptadas: 0,
    rechazadas: 0
  };

  async ngOnInit(): Promise<void> {
    const userData = await this.authService.getCurrentUserData();
    if (userData) {
      this.cargarPostulaciones(userData.uid);
      this.cargarEstadisticas(userData.uid);
    }
  }

  cargarPostulaciones(userId: string): void {
    this.loading = true;
    this.postulacionesService.getPostulacionesByEstudiante(userId).subscribe({
      next: (postulaciones) => {
        this.postulaciones = postulaciones;
        this.postulacionesFiltradas = postulaciones;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar postulaciones:', error);
        this.loading = false;
      }
    });
  }

  async cargarEstadisticas(userId: string): Promise<void> {
    this.stats = await this.postulacionesService.getEstadisticasEstudiante(userId);
  }

  aplicarFiltros(): void {
    this.postulacionesFiltradas = this.postulaciones.filter(postulacion => {
      const matchEstado = !this.filtroEstado || postulacion.estado === this.filtroEstado;
      const matchSearch = !this.searchText ||
        (postulacion.ofertaTitulo?.toLowerCase().includes(this.searchText.toLowerCase()) ?? false) ||
        (postulacion.empresaNombre?.toLowerCase().includes(this.searchText.toLowerCase()) ?? false);

      return matchEstado && matchSearch;
    });
  }

  cancelarPostulacion(postulacion: Postulacion): void {
    if (confirm('¿Estás seguro de cancelar esta postulación?')) {
      this.postulacionesService.deletePostulacion(postulacion.id!).subscribe({
        next: () => {
          this.postulaciones = this.postulaciones.filter(p => p.id !== postulacion.id);
          this.aplicarFiltros();
          alert('Postulación cancelada exitosamente');

          const userData = this.authService.getCurrentUserId();
          if (userData) {
            this.cargarEstadisticas(userData);
          }
        },
        error: (error) => {
          console.error('Error al cancelar:', error);
          alert('Error al cancelar la postulación');
        }
      });
    }
  }
 
  getFechaPostulacion(postulacion: Postulacion): Date {
    if (postulacion.fechaPostulacion instanceof Date) {
      return postulacion.fechaPostulacion;
    }
    return (postulacion.fechaPostulacion as any)?.toDate() || new Date();
  }

  getFechaRevision(postulacion: Postulacion): Date {
    if (postulacion.fechaRevision instanceof Date) {
      return postulacion.fechaRevision;
    }
    return (postulacion.fechaRevision as any)?.toDate() || new Date();
  }
}