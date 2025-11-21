// src/app/pages/ofertas-list/ofertas-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OfertasService } from '../../core/services/ofertas.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

@Component({
  selector: 'app-ofertas-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterPipe, CategoriaPipe, HighlightDirective],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-list-task"></i> Ofertas Laborales
          </h2>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por título, empresa o ubicación..."
              [(ngModel)]="searchText"
              (ngModelChange)="aplicarFiltros()">
          </div>
        </div>

        <div class="col-md-2 mb-3">
          <select class="form-select" [(ngModel)]="filtroCategoria" (change)="aplicarFiltros()">
            <option value="">Todas las categorías</option>
            <option value="practicas">Prácticas</option>
            <option value="medio-tiempo">Medio Tiempo</option>
            <option value="tiempo-completo">Tiempo Completo</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <select class="form-select" [(ngModel)]="filtroModalidad" (change)="aplicarFiltros()">
            <option value="">Todas las modalidades</option>
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <select class="form-select" [(ngModel)]="ordenamiento" (change)="aplicarOrdenamiento()">
            <option value="recientes">Más Recientes</option>
            <option value="antiguas">Más Antiguas</option>
            <option value="postulaciones">Más Postulaciones</option>
            <option value="vacantes">Más Vacantes</option>
          </select>
        </div>
      </div>

      <!-- Resultados -->
      <div class="row mb-3">
        <div class="col-12">
          <p class="text-muted">
            Mostrando {{ ofertasPaginadas.length }} de {{ ofertasFiltradas.length }} ofertas (página {{ currentPage }} de {{ totalPages }})
          </p>
        </div>
      </div>

      <!-- Lista de ofertas -->
      <div class="row" *ngIf="!loading && ofertasFiltradas.length > 0; else noResults">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let oferta of ofertasPaginadas">
          <div class="card h-100 shadow-sm hover-card" appHighlight="#f0f8ff">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary">{{ oferta.categoria | categoria }}</span>
                <span class="badge" [ngClass]="{
                  'bg-success': oferta.modalidad === 'remoto',
                  'bg-info': oferta.modalidad === 'hibrido',
                  'bg-secondary': oferta.modalidad === 'presencial'
                }">
                  {{ oferta.modalidad }}
                </span>
              </div>
              
              <h5 class="card-title">{{ oferta.titulo }}</h5>
              <h6 class="card-subtitle mb-3 text-muted">
                <i class="bi bi-building"></i> {{ oferta.empresaNombre }}
              </h6>
              
              <p class="card-text text-truncate-3">
                {{ oferta.descripcion }}
              </p>
              
              <div class="mt-3">
                <small class="text-muted d-block">
                  <i class="bi bi-geo-alt"></i> {{ oferta.ubicacion }}
                </small>
                <small class="text-muted d-block">
                  <i class="bi bi-people"></i> {{ oferta.postulaciones ?? 0 }} postulaciones
                </small>
                <small class="text-muted d-block" *ngIf="oferta.salario">
                  <i class="bi bi-cash"></i> S/. {{ oferta.salario | number }}
                </small>
                <small class="text-muted d-block">
                  <i class="bi bi-briefcase"></i> {{ oferta.vacantes ?? 0 }} vacantes
                </small>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <a [routerLink]="['/ofertas', oferta.id]" class="btn btn-outline-primary w-100">
                <i class="bi bi-eye"></i> Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="row mt-4" *ngIf="!loading && ofertasFiltradas.length > pageSize">
        <div class="col-12">
          <nav aria-label="Paginación de ofertas">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <a class="page-link" href="#" (click)="paginaAnterior(); $event.preventDefault()" aria-label="Anterior">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" *ngFor="let page of [].constructor(totalPages); let i = index"
                  [class.active]="currentPage === i + 1">
                <a class="page-link" href="#" (click)="cambiarPagina(i + 1); $event.preventDefault()">{{ i + 1 }}</a>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <a class="page-link" href="#" (click)="paginaSiguiente(); $event.preventDefault()" aria-label="Siguiente">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <ng-template #noResults>
        <div class="text-center py-5" *ngIf="!loading">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="lead text-muted mt-3">No se encontraron ofertas</p>
          <button class="btn btn-primary" (click)="limpiarFiltros()">
            Limpiar Filtros
          </button>
        </div>
        <div class="text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando ofertas...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
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
  `]
})
export class OfertasListComponent implements OnInit {
  private ofertasService = inject(OfertasService);

  ofertas: OfertaLaboral[] = [];
  ofertasFiltradas: OfertaLaboral[] = [];
  searchText = '';
  filtroCategoria = '';
  filtroModalidad = '';
  ordenamiento = 'recientes';
  loading = true;

  // Propiedades de paginación
  currentPage = 1;
  pageSize = 9; // 3x3 grid
  totalPages = 0;

  // Getter para ofertas paginadas
  get ofertasPaginadas(): OfertaLaboral[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.ofertasFiltradas.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.loading = true;
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
        this.ofertasFiltradas = ofertas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.ofertasFiltradas = this.ofertas.filter(oferta => {
      const matchCategoria = !this.filtroCategoria || oferta.categoria === this.filtroCategoria;
      const matchModalidad = !this.filtroModalidad || oferta.modalidad === this.filtroModalidad;
      const matchSearch = !this.searchText ||
        oferta.titulo?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        oferta.empresaNombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        oferta.ubicacion?.toLowerCase().includes(this.searchText.toLowerCase());

      return matchCategoria && matchModalidad && matchSearch;
    });
    this.currentPage = 1; // Resetear página al aplicar filtros
    this.aplicarOrdenamiento();
  }

  aplicarOrdenamiento(): void {
    switch(this.ordenamiento) {
      case 'recientes':
        this.ofertasFiltradas.sort((a, b) =>
          b.createdAt.toMillis() - a.createdAt.toMillis()
        );
        break;
      case 'antiguas':
        this.ofertasFiltradas.sort((a, b) =>
          a.createdAt.toMillis() - b.createdAt.toMillis()
        );
        break;
      case 'postulaciones':
        this.ofertasFiltradas.sort((a, b) => (b.postulaciones || 0) - (a.postulaciones || 0));
        break;
      case 'vacantes':
        this.ofertasFiltradas.sort((a, b) => (b.vacantes || 0) - (a.vacantes || 0));
        break;
    }
    this.calcularTotalPages();
  }

  limpiarFiltros(): void {
    this.searchText = '';
    this.filtroCategoria = '';
    this.filtroModalidad = '';
    this.ordenamiento = 'recientes';
    this.ofertasFiltradas = this.ofertas;
    this.currentPage = 1; // Resetear página al limpiar filtros
    this.aplicarOrdenamiento();
  }

  // Métodos de paginación
  calcularTotalPages(): void {
    this.totalPages = Math.ceil(this.ofertasFiltradas.length / this.pageSize);
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
