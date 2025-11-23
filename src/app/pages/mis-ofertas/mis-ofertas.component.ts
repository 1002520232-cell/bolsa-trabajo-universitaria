import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { AuthService } from '../../core/services/auth.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-mis-ofertas',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriaPipe],
  template: `
    <div class="container mt-4 mb-5">

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

                </div>
              </div>

            </div>
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

  ofertas: OfertaLaboral[] = [];
  ofertasActivas = 0;
  totalPostulaciones = 0;
  loading = true;

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.cargarMisOfertas(userId);
    }
  }

  cargarMisOfertas(userId: string): void {
    this.loading = true;

    this.ofertasService.getOfertasByUser(userId).subscribe({
      next: (ofertas: OfertaLaboral[]) => {
        this.ofertas = ofertas;
        this.ofertasActivas = ofertas.filter((o: OfertaLaboral) => o.estado === 'activa').length;
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
}
