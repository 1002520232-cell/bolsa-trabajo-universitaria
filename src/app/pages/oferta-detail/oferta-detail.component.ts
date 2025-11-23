import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { PostulacionesService } from '../../core/services/postulaciones.service';
import { AuthService } from '../../core/services/auth.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-oferta-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriaPipe],
  template: `
    <div class="container mt-4 mb-5" *ngIf="oferta; else loading">
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span class="badge bg-primary me-2">{{ oferta.categoria | categoria }}</span>
                  <span class="badge bg-secondary">{{ oferta.modalidad }}</span>
                </div>
                <span class="badge" [ngClass]="{
                  'bg-success': oferta.estado === 'activa',
                  'bg-danger': oferta.estado === 'cerrada',
                  'bg-warning': oferta.estado === 'pausada'
                }">
                  {{ oferta.estado }}
                </span>
              </div>

              <h2 class="mb-3">{{ oferta.titulo }}</h2>
              
              <h5 class="text-primary mb-4">
                <i class="bi bi-building"></i> 
                <a [routerLink]="['/empresas', oferta.empresaId]" class="text-decoration-none">
                  {{ oferta.empresaNombre }}
                </a>
              </h5>

              <div class="row mb-4">
                <div class="col-md-6 mb-3">
                  <p class="mb-2"><strong><i class="bi bi-geo-alt"></i> Ubicación:</strong></p>
                  <p class="text-muted">{{ oferta.ubicacion }}</p>
                </div>
                <div class="col-md-6 mb-3" *ngIf="oferta.salario">
                  <p class="mb-2"><strong><i class="bi bi-cash"></i> Salario:</strong></p>
                  <p class="text-muted">S/. {{ oferta.salario | number }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <p class="mb-2"><strong><i class="bi bi-briefcase"></i> Vacantes:</strong></p>
                  <p class="text-muted">{{ oferta.vacantes }}</p>
                </div>
                <div class="col-md-6 mb-3">
                  <p class="mb-2"><strong><i class="bi bi-people"></i> Postulaciones:</strong></p>
                  <p class="text-muted">{{ oferta.postulaciones }}</p>
                </div>
              </div>

              <hr>

              <h5 class="mb-3">Descripción del Puesto</h5>
              <p class="text-justify">{{ oferta.descripcion }}</p>

              <hr>

              <h5 class="mb-3">Requisitos</h5>
              <ul class="list-unstyled">
                <li *ngFor="let requisito of oferta.requisitos" class="mb-2">
                  <i class="bi bi-check-circle-fill text-success"></i> {{ requisito }}
                </li>
              </ul>

              <hr>

              <div class="row">
                <div class="col-md-6" *ngIf="oferta.fechaInicio">
                  <p class="mb-2"><strong>Fecha de Inicio:</strong></p>
                  <p class="text-muted">{{ getFecha(oferta.fechaInicio) }}</p>
                </div>
                <div class="col-md-6" *ngIf="oferta.fechaFin">
                  <p class="mb-2"><strong>Fecha de Cierre:</strong></p>
                  <p class="text-muted">{{ getFecha(oferta.fechaFin) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="mb-4">¿Te interesa esta oferta?</h5>

              <div *ngIf="isAuthenticated; else loginRequired">
                <button 
                  class="btn btn-primary w-100 mb-3"
                  (click)="postularse()"
                  [disabled]="yaPostulado || oferta.estado !== 'activa' || procesando">
                  <span *ngIf="!procesando">
                    <i class="bi" [ngClass]="yaPostulado ? 'bi-check-circle' : 'bi-send'"></i>
                    {{ yaPostulado ? 'Ya Postulaste' : 'Postularme' }}
                  </span>
                  <span *ngIf="procesando">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Procesando...
                  </span>
                </button>

                <div class="alert alert-success" *ngIf="mensajeExito">
                  <i class="bi bi-check-circle"></i> {{ mensajeExito }}
                </div>

                <div class="alert alert-danger" *ngIf="mensajeError">
                  <i class="bi bi-exclamation-triangle"></i> {{ mensajeError }}
                </div>

                <p class="text-muted small" *ngIf="oferta.estado !== 'activa'">
                  Esta oferta ya no está disponible
                </p>
              </div>

              <ng-template #loginRequired>
                <p class="text-muted mb-3">Debes iniciar sesión para postularte</p>
                <a routerLink="/login" class="btn btn-primary w-100">
                  <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                </a>
              </ng-template>

              <hr>

              <div class="d-grid gap-2">
                <a routerLink="/ofertas" class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left"></i> Volver a Ofertas
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="container mt-5">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando oferta...</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .text-justify {
      text-align: justify;
    }
    .sticky-top {
      position: sticky;
      z-index: 1020;
    }
  `]
})
export class OfertaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ofertasService = inject(OfertasService);
  private postulacionesService = inject(PostulacionesService);
  private authService = inject(AuthService);

  oferta: OfertaLaboral | null = null;
  isAuthenticated = false;
  yaPostulado = false;
  procesando = false;
  mensajeExito = '';
  mensajeError = '';

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = this.authService.isAuthenticated();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarOferta(id);
      if (this.isAuthenticated) {
        await this.verificarPostulacion(id);
      }
    }
  }

  getFecha(fecha: any): string {
    if (!fecha) {
      return '';
    }
    if (fecha.toDate) {
      return fecha.toDate().toLocaleDateString('es-ES');
    }
    if (fecha instanceof Date) {
      return fecha.toLocaleDateString('es-ES');
    }
    return String(fecha);
  }

  cargarOferta(id: string): void {
    this.ofertasService.getOfertaById(id).subscribe({
      next: (oferta) => {
        this.oferta = oferta;
      },
      error: (error) => {
        console.error('Error al cargar oferta:', error);
        this.router.navigate(['/ofertas']);
      }
    });
  }

  async verificarPostulacion(ofertaId: string): Promise<void> {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.yaPostulado = await this.postulacionesService.existePostulacion(ofertaId, userId);
    }
  }

  async postularse(): Promise<void> {
    if (!this.oferta || this.yaPostulado) return;

    this.procesando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    try {
      const userData = await this.authService.getCurrentUserData();
      if (!userData) {
        this.mensajeError = 'Debes iniciar sesión';
        this.procesando = false;
        return;
      }

      const postulacion = {
        ofertaId: this.oferta.id!,
        ofertaTitulo: this.oferta.titulo,
        empresaNombre: this.oferta.empresaNombre,
        estudianteId: userData.uid,
        estudianteNombre: `${userData.nombre} ${userData.apellido}`,
        estudianteEmail: userData.email,
        estudianteCarrera: userData.carrera
      };

      this.postulacionesService.createPostulacion(postulacion).subscribe({
        next: () => {
          this.ofertasService.incrementarPostulaciones(this.oferta!.id!).then(() => {
            this.yaPostulado = true;
            this.mensajeExito = '¡Postulación enviada exitosamente!';
            this.procesando = false;
            if (this.oferta != null) {
              this.oferta.postulaciones = (this.oferta.postulaciones ?? 0) + 1;
            }
          }).catch(error => {
            console.error('Error al incrementar postulaciones:', error);
          });
        },
        error: (error) => {
          console.error('Error al postularse:', error);
          this.mensajeError = 'Error al enviar postulación. Intenta nuevamente.';
          this.procesando = false;
        }
      });

    } catch (error) {
      console.error('Error en la obtención de datos de usuario:', error);
      this.mensajeError = 'Error interno. Por favor, intenta nuevamente.';
      this.procesando = false;
    }
  }
}
