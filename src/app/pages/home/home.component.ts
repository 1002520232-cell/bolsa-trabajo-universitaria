// src/app/pages/home/home.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoriaPipe],
  template: `
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">
              Encuentra tu próxima oportunidad laboral
            </h1>
            <p class="lead mb-4">
              Conectamos estudiantes universitarios con las mejores empresas del mercado
            </p>
            <div class="d-flex gap-3">
              <a routerLink="/ofertas" class="btn btn-primary btn-lg">
                <i class="bi bi-search"></i> Ver Ofertas
              </a>
              <a routerLink="/register" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-person-plus"></i> Registrarse
              </a>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <i class="bi bi-briefcase-fill hero-icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5">
      <h2 class="text-center mb-5">Últimas Ofertas Publicadas</h2>
      
      <div class="row" *ngIf="ofertas.length > 0; else noOfertas">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let oferta of ofertas.slice(0, 6)">
          <div class="card h-100 shadow-sm hover-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary">{{ oferta.categoria | categoria }}</span>
                <span class="badge bg-secondary">{{ oferta.modalidad }}</span>
              </div>
              
              <h5 class="card-title">{{ oferta.titulo }}</h5>
              <h6 class="card-subtitle mb-3 text-muted">
                <i class="bi bi-building"></i> {{ oferta.empresaNombre }}
              </h6>
              
              <p class="card-text text-truncate-3">
                {{ oferta.descripcion }}
              </p>
              
              <div class="mt-3">
                <small class="text-muted">
                  <i class="bi bi-geo-alt"></i> {{ oferta.ubicacion }}
                </small>
                <br>
                <small class="text-muted">
                  <i class="bi bi-people"></i> {{ oferta.postulaciones ?? 0 }} postulaciones
                </small>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <a [routerLink]="['/ofertas', oferta.id]" class="btn btn-outline-primary w-100">
                Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noOfertas>
        <div class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="lead text-muted mt-3">No hay ofertas disponibles</p>
        </div>
      </ng-template>

      <div class="text-center mt-4" *ngIf="ofertas.length > 0">
        <a routerLink="/ofertas" class="btn btn-primary btn-lg">
          Ver Todas las Ofertas
        </a>
      </div>
    </div>

    <div class="features-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">¿Por qué elegirnos?</h2>
        <div class="row">
          <div class="col-md-4 text-center mb-4">
            <i class="bi bi-shield-check feature-icon text-primary"></i>
            <h4 class="mt-3">Empresas Verificadas</h4>
            <p>Trabajamos solo con empresas confiables y reconocidas</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="bi bi-clock-history feature-icon text-primary"></i>
            <h4 class="mt-3">Ofertas Actualizadas</h4>
            <p>Nuevas oportunidades laborales cada día</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <i class="bi bi-graph-up feature-icon text-primary"></i>
            <h4 class="mt-3">Impulsa tu Carrera</h4>
            <p>Encuentra prácticas y empleos acordes a tu perfil</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      margin-bottom: 50px;
    }
    .hero-icon {
      font-size: 15rem;
      color: rgba(255, 255, 255, 0.3);
    }
    .hover-card {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .hover-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
    }
    .text-truncate-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .feature-icon {
      font-size: 4rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  private ofertasService = inject(OfertasService);
  ofertas: OfertaLaboral[] = [];

  ngOnInit(): void {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
      },
      error: (error) => console.error('Error al cargar ofertas:', error)
    });
  }
}