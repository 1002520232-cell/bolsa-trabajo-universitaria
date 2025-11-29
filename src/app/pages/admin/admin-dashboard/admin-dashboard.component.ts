import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OfertasService } from '../../../core/services/ofertas.service';
import { PostulacionesService } from '../../../core/services/postulaciones.service';
import { EmpresasService } from '../../../core/services/empresas.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-speedometer2"></i> Dashboard de Administración
          </h2>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-building display-4 text-primary mb-3"></i>
              <h3 class="mb-0">{{ totalEmpresas }}</h3>
              <p class="text-muted mb-0">Empresas Totales</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-building-check display-4 text-success mb-3"></i>
              <h3 class="mb-0">{{ empresasAprobadas }}</h3>
              <p class="text-muted mb-0">Empresas Aprobadas</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-briefcase display-4 text-info mb-3"></i>
              <h3 class="mb-0">{{ totalOfertas }}</h3>
              <p class="text-muted mb-0">Ofertas Totales</p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card text-center shadow-sm stat-card">
            <div class="card-body">
              <i class="bi bi-file-text display-4 text-warning mb-3"></i>
              <h3 class="mb-0">{{ totalPostulaciones }}</h3>
              <p class="text-muted mb-0">Postulaciones Totales</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <a routerLink="/admin/empresas" class="btn btn-outline-primary btn-lg w-100">
                    <i class="bi bi-building"></i><br>
                    Revisar Empresas Pendientes
                  </a>
                </div>
                <div class="col-md-4 mb-3">
                  <a routerLink="/admin/ofertas" class="btn btn-outline-success btn-lg w-100">
                    <i class="bi bi-briefcase"></i><br>
                    Revisar Ofertas Pendientes
                  </a>
                </div>
                <div class="col-md-4 mb-3">
                  <a routerLink="/admin/estadisticas" class="btn btn-outline-info btn-lg w-100">
                    <i class="bi bi-graph-up"></i><br>
                    Ver Estadísticas Globales
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de pendientes -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0">
                <i class="bi bi-exclamation-triangle"></i> Pendientes de Revisión
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  Empresas pendientes
                  <span class="badge bg-warning rounded-pill">{{ empresasPendientes }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  Ofertas pendientes
                  <span class="badge bg-warning rounded-pill">{{ ofertasPendientes }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">
                <i class="bi bi-info-circle"></i> Información del Sistema
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  Usuarios registrados
                  <span class="badge bg-info rounded-pill">{{ totalUsuarios }}</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  Ofertas activas
                  <span class="badge bg-info rounded-pill">{{ ofertasActivas }}</span>
                </div>
              </div>
            </div>
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
    .btn-outline-primary, .btn-outline-success, .btn-outline-info {
      transition: all 0.3s;
    }
    .btn-outline-primary:hover, .btn-outline-success:hover, .btn-outline-info:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private ofertasService = inject(OfertasService);
  private postulacionesService = inject(PostulacionesService);
  private empresasService = inject(EmpresasService);

  totalEmpresas = 0;
  empresasAprobadas = 0;
  empresasPendientes = 0;
  totalOfertas = 0;
  ofertasPendientes = 0;
  ofertasActivas = 0;
  totalPostulaciones = 0;
  totalUsuarios = 0;

  ngOnInit() {
    this.cargarDatos();
  }

  private cargarDatos() {
    // Cargar empresas
    this.empresasService.getEmpresas().subscribe(empresas => {
      this.totalEmpresas = empresas.length;
      this.empresasAprobadas = empresas.filter(e => e.aprobada === true).length;
      this.empresasPendientes = empresas.filter(e => e.aprobada === false || e.aprobada === undefined).length;
    });

    // Cargar ofertas
    this.ofertasService.getOfertas().subscribe(ofertas => {
      this.totalOfertas = ofertas.length;
      this.ofertasPendientes = ofertas.filter(o => o.aprobada === false || o.aprobada === undefined).length;
      this.ofertasActivas = ofertas.filter(o => o.activa && o.aprobada === true).length;
    });

    // Cargar postulaciones
    this.postulacionesService.getAllPostulaciones().subscribe(postulaciones => {
      this.totalPostulaciones = postulaciones.length;
    });

    // Cargar usuarios
    this.authService.getAllUsers().subscribe(usuarios => {
      this.totalUsuarios = usuarios.length;
    });
  }
}
