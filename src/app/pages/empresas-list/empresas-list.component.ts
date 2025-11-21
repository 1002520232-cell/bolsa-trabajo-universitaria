// src/app/pages/empresas-list/empresas-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpresasService } from '../../core/services/empresas.service';
import { Empresa } from '../../core/models/empresa.model';
import { FilterPipe } from '../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-empresas-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-building"></i> Empresas Registradas
          </h2>
        </div>
      </div>

      <!-- Búsqueda -->
      <div class="row mb-4">
        <div class="col-md-8 mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por nombre, sector o ubicación..."
              [(ngModel)]="searchText">
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <select class="form-select" [(ngModel)]="filtroSector" (change)="aplicarFiltros()">
            <option value="">Todos los sectores</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Educación">Educación</option>
            <option value="Salud">Salud</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Retail">Retail</option>
            <option value="Manufactura">Manufactura</option>
            <option value="Servicios">Servicios</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <!-- Resultados -->
      <div class="row mb-3">
        <div class="col-12">
          <p class="text-muted">
            Mostrando {{ empresasFiltradas.length }} de {{ empresas.length }} empresas
          </p>
        </div>
      </div>

      <!-- Lista de empresas -->
      <div class="row" *ngIf="!loading && empresasFiltradas.length > 0; else noResults">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let empresa of empresasFiltradas">
          <div class="card h-100 shadow-sm hover-card">
            <div class="card-body">
              <div class="text-center mb-3">
                <div class="empresa-logo">
                  <i class="bi bi-building-fill text-primary"></i>
                </div>
              </div>
              
              <h5 class="card-title text-center">{{ empresa.nombre }}</h5>
              
              <div class="mb-3">
                <span class="badge bg-primary">{{ empresa.sector ?? 'Sin sector' }}</span>
              </div>
              
              <p class="card-text text-truncate-3">
                {{ empresa.descripcion }}
              </p>
              
              <hr>
              
              <div class="small">
                <p class="mb-2">
                  <i class="bi bi-geo-alt text-muted"></i>
                  <span class="text-muted">{{ empresa.ubicacion }}</span>
                </p>
                <p class="mb-2">
                  <i class="bi bi-telephone text-muted"></i>
                  <span class="text-muted">{{ empresa.telefono }}</span>
                </p>
                <p class="mb-0" *ngIf="empresa.sitioWeb">
                  <i class="bi bi-globe text-muted"></i>
                  <a [href]="empresa.sitioWeb" target="_blank" class="text-decoration-none small">
                    Sitio Web
                  </a>
                </p>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <a [routerLink]="['/empresas', empresa.id]" class="btn btn-outline-primary w-100">
                <i class="bi bi-eye"></i> Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noResults>
        <div class="text-center py-5" *ngIf="!loading">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="lead text-muted mt-3">No se encontraron empresas</p>
          <button class="btn btn-primary" (click)="limpiarFiltros()">
            Limpiar Filtros
          </button>
        </div>
        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando empresas...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .hover-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
    }
    .empresa-logo {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 50%;
    }
    .empresa-logo i {
      font-size: 3rem;
    }
    .text-truncate-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class EmpresasListComponent implements OnInit {
  private empresasService = inject(EmpresasService);

  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  searchText = '';
  filtroSector = '';
  loading = true;

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.loading = true;
    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.empresasFiltradas = empresas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar empresas:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.empresasFiltradas = this.empresas.filter(empresa => {
      const matchSector = !this.filtroSector || empresa.sector === this.filtroSector;
      const matchSearch = !this.searchText || 
        empresa.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (empresa.sector ?? '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        empresa.ubicacion.toLowerCase().includes(this.searchText.toLowerCase());
      
      return matchSector && matchSearch;
    });
  }

  limpiarFiltros(): void {
    this.searchText = '';
    this.filtroSector = '';
    this.empresasFiltradas = this.empresas;
  }
}