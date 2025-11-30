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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 120px 0 80px;
      margin-bottom: 60px;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;
    }

    .hero-section .container {
      position: relative;
      z-index: 2;
    }

    .hero-icon {
      font-size: 18rem;
      color: rgba(255, 255, 255, 0.15);
      animation: pulse 3s ease-in-out infinite;
      filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
    }

    .display-4 {
      font-size: 3.5rem;
      font-weight: 800;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(255,255,255,0.3);
      animation: slideInLeft 1s ease-out;
    }

    .lead {
      font-size: 1.25rem;
      opacity: 0.9;
      animation: slideInLeft 1s ease-out 0.2s both;
    }

    .btn {
      border-radius: 50px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
      border: none;
      box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
      animation: slideInLeft 1s ease-out 0.4s both;
    }

    .btn-primary:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
    }

    .btn-outline-primary {
      border: 2px solid rgba(255,255,255,0.8);
      color: white;
      background: transparent;
      animation: slideInLeft 1s ease-out 0.6s both;
    }

    .btn-outline-primary:hover {
      background: white;
      color: #667eea;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 32px rgba(255,255,255,0.3);
    }

    .hover-card {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .hover-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }

    .hover-card:hover::before {
      opacity: 1;
    }

    .hover-card:hover {
      transform: translateY(-15px) rotate(1deg);
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    .hover-card .card-body {
      position: relative;
      z-index: 2;
    }

    .text-truncate-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .badge {
      border-radius: 20px;
      font-weight: 600;
      padding: 0.5rem 1rem;
    }

    .features-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 80px 0;
      position: relative;
    }

    .features-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(102,126,234,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(118,75,162,0.1)"/><circle cx="50" cy="50" r="1" fill="rgba(240,147,251,0.1)"/></svg>');
    }

    .features-section h2 {
      color: #2c3e50;
      font-weight: 800;
      margin-bottom: 60px;
      position: relative;
    }

    .features-section h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 2px;
    }

    .feature-icon {
      font-size: 5rem;
      color: #667eea;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
      filter: drop-shadow(0 4px 8px rgba(102,126,234,0.3));
    }

    .feature-icon:hover {
      transform: scale(1.1);
      color: #764ba2;
    }

    .features-section h4 {
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .features-section p {
      color: #5a6c7d;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 80px 0 60px;
      }

      .display-4 {
        font-size: 2.5rem;
      }

      .hero-icon {
        font-size: 12rem;
      }

      .lead {
        font-size: 1.1rem;
      }

      .btn {
        padding: 0.75rem 2rem;
        font-size: 0.9rem;
      }

      .hover-card:hover {
        transform: translateY(-5px) rotate(0deg);
      }

      .feature-icon {
        font-size: 3rem;
      }
    }

    @media (max-width: 576px) {
      .display-4 {
        font-size: 2rem;
      }

      .hero-icon {
        font-size: 8rem;
      }
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