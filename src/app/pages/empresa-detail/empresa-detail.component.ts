// src/app/pages/empresa-detail/empresa-detail.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpresasService } from '../../core/services/empresas.service';
import { OfertasService } from '../../core/services/ofertas.service';
import { AuthService } from '../../core/services/auth.service';
import { Empresa } from '../../core/models/empresa.model';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-empresa-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriaPipe],
  template: `
    <div class="container mt-4 mb-5" *ngIf="empresa; else loading">
      <div class="row">
        <div class="col-lg-4">
          <div class="card shadow-sm mb-4">
            <div class="card-body text-center">
              <div class="empresa-logo mb-3">
                <i class="bi bi-building-fill text-primary"></i>
              </div>
              <h3 class="mb-3">{{ empresa.nombre }}</h3>
              <span class="badge bg-primary mb-3">{{ empresa.sector }}</span>
              
              <hr>
              
              <div class="text-start">
                <p class="mb-2">
                  <i class="bi bi-card-text text-muted"></i>
                  <strong> RUC:</strong> {{ empresa.ruc }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-geo-alt text-muted"></i>
                  <strong> Ubicación:</strong><br>
                  {{ empresa.ubicacion }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-telephone text-muted"></i>
                  <strong> Teléfono:</strong><br>
                  {{ empresa.telefono }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-envelope text-muted"></i>
                  <strong> Email:</strong><br>
                  <a [href]="'mailto:' + empresa.email">{{ empresa.email }}</a>
                </p>
                <p class="mb-0" *ngIf="empresa.sitioWeb">
                  <i class="bi bi-globe text-muted"></i>
                  <strong> Sitio Web:</strong><br>
                  <a [href]="empresa.sitioWeb" target="_blank" class="text-decoration-none">
                    Visitar sitio <i class="bi bi-box-arrow-up-right"></i>
                  </a>
                </p>
              </div>

              <hr>

              <div class="d-grid gap-2" *ngIf="puedeEditar">
                <a [routerLink]="['/empresas-form', empresa.id]" class="btn btn-primary">
                  <i class="bi bi-pencil"></i> Editar Empresa
                </a>
                <button class="btn btn-danger" (click)="eliminarEmpresa()">
                  <i class="bi bi-trash"></i> Eliminar Empresa
                </button>
              </div>

              <a routerLink="/empresas" class="btn btn-outline-secondary w-100 mt-3">
                <i class="bi bi-arrow-left"></i> Volver
              </a>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <h4 class="mb-3">Acerca de la Empresa</h4>
              <p class="text-justify">{{ empresa.descripcion }}</p>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h4 class="mb-0">
                <i class="bi bi-briefcase"></i> Ofertas Laborales
                <span class="badge bg-primary ms-2">{{ ofertas.length }}</span>
              </h4>
            </div>
            <div class="card-body" *ngIf="ofertas.length > 0; else noOfertas">
              <div class="list-group">
                <a 
                  [routerLink]="['/ofertas', oferta.id]"
                  class="list-group-item list-group-item-action"
                  *ngFor="let oferta of ofertas">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <h6 class="mb-1">{{ oferta.titulo }}</h6>
              <div class="mb-2">
    <span class="badge bg-primary me-2">{{ oferta.categoria | categoria }}</span>
                        <span class="badge bg-secondary">{{ oferta.modalidad }}</span>
                      </div>
                      <small class="text-muted">
                        <i class="bi bi-geo-alt"></i> {{ oferta.ubicacion }} |
                        <i class="bi bi-people"></i> {{ oferta.postulaciones }} postulaciones
                      </small>
                    </div>
                    <span class="badge" [ngClass]="{
                      'bg-success': oferta.estado === 'activa',
                      'bg-danger': oferta.estado === 'cerrada',
                      'bg-warning': oferta.estado === 'pausada'
                    }">
                      {{ oferta.estado }}
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <ng-template #noOfertas>
              <div class="card-body text-center text-muted py-5">
                <i class="bi bi-inbox display-4"></i>
                <p class="mt-3">Esta empresa aún no ha publicado ofertas</p>
              </div>
            </ng-template>
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
          <p class="mt-3">Cargando empresa...</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .empresa-logo {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 50%;
    }
    .empresa-logo i {
      font-size: 5rem;
    }
    .text-justify {
      text-align: justify;
    }
  `]
})
export class EmpresaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private empresasService = inject(EmpresasService);
  private ofertasService = inject(OfertasService);
  private authService = inject(AuthService);

  empresa: Empresa | null = null;
  ofertas: OfertaLaboral[] = [];
  puedeEditar = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEmpresa(id);
      this.cargarOfertas(id);
    }
  }

  cargarEmpresa(id: string): void {
    this.empresasService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        this.empresa = empresa;
        this.verificarPermisos();
      },
      error: (error) => {
        console.error('Error al cargar empresa:', error);
        this.router.navigate(['/empresas']);
      }
    });
  }

  cargarOfertas(empresaId: string): void {
    this.ofertasService.getOfertasByEmpresa(empresaId).subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
      },
      error: (error) => console.error('Error al cargar ofertas:', error)
    });
  }

  verificarPermisos(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId && this.empresa) {
      this.puedeEditar = this.empresa.createdBy === userId;
    }
  }

  async eliminarEmpresa(): Promise<void> {
    if (!this.empresa) return;

    if (confirm(`¿Estás seguro de eliminar la empresa "${this.empresa.nombre}"?`)) {
      try {
        await this.empresasService.deleteEmpresa(this.empresa.id!);
        alert('Empresa eliminada exitosamente');
        this.router.navigate(['/empresas']);
      } catch (error: any) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la empresa');
      }
    }
  }
}