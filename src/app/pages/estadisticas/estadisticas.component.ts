// src/app/pages/estadisticas/estadisticas.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PostulacionesService } from '../../core/services/postulaciones.service';
import { OfertasService } from '../../core/services/ofertas.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { Postulacion } from '../../core/models/postulacion.model';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4 mb-5">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-graph-up"></i> Estadísticas y Resumen
          </h2>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-file-text display-4 text-primary mb-3"></i>
              <h3 class="mb-0">{{ stats.totalPostulaciones }}</h3>
              <p class="text-muted mb-0">Total Postulaciones</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-clock-history display-4 text-warning mb-3"></i>
              <h3 class="mb-0">{{ stats.pendientes }}</h3>
              <p class="text-muted mb-0">Pendientes</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-check-circle display-4 text-success mb-3"></i>
              <h3 class="mb-0">{{ stats.aceptadas }}</h3>
              <p class="text-muted mb-0">Aceptadas</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-percent display-4 text-info mb-3"></i>
              <h3 class="mb-0">{{ tasaExito }}%</h3>
              <p class="text-muted mb-0">Tasa de Éxito</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución por estado -->
      <div class="row mb-4">
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="bi bi-pie-chart"></i> Distribución por Estado
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>Pendientes</span>
                  <strong>{{ stats.pendientes }}</strong>
                </div>
                <div class="progress mb-3" style="height: 25px;">
                  <div 
                    class="progress-bar bg-warning" 
                    [style.width.%]="getPercentage(stats.pendientes)"
                    role="progressbar">
                    {{ getPercentage(stats.pendientes) }}%
                  </div>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span>En Revisión</span>
                  <strong>{{ stats.revisadas }}</strong>
                </div>
                <div class="progress mb-3" style="height: 25px;">
                  <div 
                    class="progress-bar bg-info" 
                    [style.width.%]="getPercentage(stats.revisadas)"
                    role="progressbar">
                    {{ getPercentage(stats.revisadas) }}%
                  </div>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span>Aceptadas</span>
                  <strong>{{ stats.aceptadas }}</strong>
                </div>
                <div class="progress mb-3" style="height: 25px;">
                  <div 
                    class="progress-bar bg-success" 
                    [style.width.%]="getPercentage(stats.aceptadas)"
                    role="progressbar">
                    {{ getPercentage(stats.aceptadas) }}%
                  </div>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span>Rechazadas</span>
                  <strong>{{ stats.rechazadas }}</strong>
                </div>
                <div class="progress" style="height: 25px;">
                  <div 
                    class="progress-bar bg-danger" 
                    [style.width.%]="getPercentage(stats.rechazadas)"
                    role="progressbar">
                    {{ getPercentage(stats.rechazadas) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen general -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="bi bi-info-circle"></i> Resumen General
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-briefcase text-primary"></i> Ofertas Activas</span>
                  <span class="badge bg-primary rounded-pill">{{ totalOfertasActivas }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-building text-info"></i> Empresas Registradas</span>
                  <span class="badge bg-info rounded-pill">{{ totalEmpresas }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-people text-success"></i> Mis Postulaciones</span>
                  <span class="badge bg-success rounded-pill">{{ stats.totalPostulaciones }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-star text-warning"></i> Tasa de Éxito</span>
                  <span class="badge bg-warning rounded-pill">{{ tasaExito }}%</span>
                </div>
              </div>

              <hr>

              <div class="alert alert-info mb-0">
                <h6 class="alert-heading">
                  <i class="bi bi-lightbulb"></i> Consejo
                </h6>
                <p class="mb-0 small">
                  <strong *ngIf="stats.aceptadas > 0">¡Excelente!</strong>
                  <span *ngIf="stats.aceptadas === 0">
                    Sigue postulándote a más ofertas para aumentar tus oportunidades.
                  </span>
                  <span *ngIf="stats.aceptadas > 0">
                    Has tenido {{ stats.aceptadas }} postulaciones aceptadas. ¡Sigue así!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimas postulaciones -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">
                <i class="bi bi-clock-history"></i> Últimas Postulaciones
              </h5>
            </div>
            <div class="card-body" *ngIf="ultimasPostulaciones.length > 0; else noPostulaciones">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Oferta</th>
                      <th>Empresa</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let postulacion of ultimasPostulaciones">
                      <td>
                        <a [routerLink]="['/ofertas', postulacion.ofertaId]" class="text-decoration-none">
                          {{ postulacion.ofertaTitulo }}
                        </a>
                      </td>
                      <td>{{ postulacion.empresaNombre }}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'bg-warning text-dark': postulacion.estado === 'pendiente',
                          'bg-info': postulacion.estado === 'revisada',
                          'bg-success': postulacion.estado === 'aceptada',
                          'bg-danger': postulacion.estado === 'rechazada'
                        }">
                          {{ postulacion.estado }}
                        </span>
                      </td>
                      <td>{{ getFechaPostulacion(postulacion) | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-center mt-3">
                <a routerLink="/mis-postulaciones" class="btn btn-primary">
                  Ver Todas las Postulaciones
                </a>
              </div>
            </div>
            <ng-template #noPostulaciones>
              <div class="card-body text-center text-muted py-5">
                <i class="bi bi-inbox display-4"></i>
                <p class="mt-3">No tienes postulaciones aún</p>
                <a routerLink="/ofertas" class="btn btn-primary">
                  Buscar Ofertas
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    .progress {
      background-color: #e9ecef;
    }
    .table-responsive {
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class EstadisticasComponent implements OnInit {
  private authService = inject(AuthService);
  private postulacionesService = inject(PostulacionesService);
  private ofertasService = inject(OfertasService);
  private empresasService = inject(EmpresasService);

  stats = {
    totalPostulaciones: 0,
    pendientes: 0,
    revisadas: 0,
    aceptadas: 0,
    rechazadas: 0
  };

  ultimasPostulaciones: Postulacion[] = [];
  totalOfertasActivas = 0;
  totalEmpresas = 0;
  tasaExito = 0;

  async ngOnInit(): Promise<void> {
    const userData = await this.authService.getCurrentUserData();
    if (userData) {
      await this.cargarEstadisticas(userData.uid);
      this.cargarPostulacionesRecientes(userData.uid);
    }
    this.cargarDatosGenerales();
  }

  async cargarEstadisticas(userId: string): Promise<void> {
    this.stats = await this.postulacionesService.getEstadisticasEstudiante(userId);
    this.calcularTasaExito();
  }

  cargarPostulacionesRecientes(userId: string): void {
    this.postulacionesService.getPostulacionesByEstudiante(userId).subscribe({
      next: (postulaciones) => {
        this.ultimasPostulaciones = postulaciones.slice(0, 5);
      },
      error: (error) => console.error('Error al cargar postulaciones:', error)
    });
  }

  cargarDatosGenerales(): void {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        this.totalOfertasActivas = ofertas.length;
      }
    });

    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.totalEmpresas = empresas.length;
      }
    });
  }

  calcularTasaExito(): void {
    if (this.stats.totalPostulaciones > 0) {
      this.tasaExito = Math.round(
        (this.stats.aceptadas / this.stats.totalPostulaciones) * 100
      );
    }
  }

  getPercentage(value: number): number {
    if (this.stats.totalPostulaciones === 0) return 0;
    return Math.round((value / this.stats.totalPostulaciones) * 100);
  }

  getFechaPostulacion(postulacion: Postulacion): Date {
    if (postulacion.fechaPostulacion instanceof Date) {
      return postulacion.fechaPostulacion;
    }
    return (postulacion.fechaPostulacion as any)?.toDate() || new Date();
  }
}