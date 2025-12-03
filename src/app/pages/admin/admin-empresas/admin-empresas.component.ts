import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpresasService } from '../../../core/services/empresas.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-admin-empresas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-4">
            <i class="bi bi-building"></i> Gestión de Empresas
          </h2>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <select class="form-select" [(ngModel)]="filtroEstado" (ngModelChange)="filtrarEmpresas()">
                    <option value="todas">Todas las empresas</option>
                    <option value="pendientes">Pendientes de aprobación</option>
                    <option value="aprobadas">Aprobadas</option>
                    <option value="rechazadas">Rechazadas</option>
                  </select>
                </div>
                <div class="col-md-8">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar por nombre..."
                    [(ngModel)]="busqueda"
                    (input)="filtrarEmpresas()">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de empresas -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Empresas ({{ empresasFiltradas.length }})</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Ubicación</th>
                      <th>Estado</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let empresa of empresasFiltradas">
                      <td>{{ empresa.nombre }}</td>
                      <td>{{ empresa.ubicacion }}</td>
                      <td>
                        <span class="badge"
                              [class]="empresa.aprobada === true ? 'bg-success' :
                                       empresa.aprobada === false ? 'bg-danger' : 'bg-warning'">
                          {{ empresa.aprobada === true ? 'Aprobada' :
                             empresa.aprobada === false ? 'Rechazada' : 'Pendiente' }}
                        </span>
                      </td>
                      <td>{{ formatDate(empresa.fechaCreacion) | date:'short' }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button *ngIf="empresa.aprobada !== true"
                                  class="btn btn-success"
                                  (click)="approveEmpresa(empresa.id!)">
                            <i class="bi bi-check"></i> Aprobar
                          </button>
                          <button *ngIf="empresa.aprobada !== false"
                                  class="btn btn-danger"
                                  (click)="rejectEmpresa(empresa.id!)">
                            <i class="bi bi-x"></i> Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="empresasFiltradas.length === 0" class="text-center py-4">
                <p class="text-muted">No se encontraron empresas con los criterios de búsqueda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
    }
    .badge {
      font-size: 0.75rem;
    }
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class AdminEmpresasComponent implements OnInit {
  private empresasService = inject(EmpresasService);

  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  filtroEstado: string = 'todas';
  busqueda: string = '';

  ngOnInit() {
    this.cargarEmpresas();
  }

  private cargarEmpresas() {
    this.empresasService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
      this.filtrarEmpresas();
    });
  }

  filtrarEmpresas() {
    let filtradas = this.empresas;

    // Filtrar por estado
    if (this.filtroEstado !== 'todas') {
      switch (this.filtroEstado) {
        case 'pendientes':
          filtradas = filtradas.filter(e => e.aprobada === undefined || e.aprobada === null);
          break;
        case 'aprobadas':
          filtradas = filtradas.filter(e => e.aprobada === true);
          break;
        case 'rechazadas':
          filtradas = filtradas.filter(e => e.aprobada === false);
          break;
      }
    }

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtradas = filtradas.filter(e =>
        e.nombre?.toLowerCase().includes(busquedaLower) ||
        e.ubicacion?.toLowerCase().includes(busquedaLower)
      );
    }

    this.empresasFiltradas = filtradas;
  }

  async approveEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas aprobar esta empresa?')) {
      try {
        await this.empresasService.approveEmpresa(empresaId);
        alert('Empresa aprobada exitosamente');
        this.cargarEmpresas();
      } catch (error) {
        alert('Error al aprobar la empresa');
      }
    }
  }

  async rejectEmpresa(empresaId: string) {
    if (confirm('¿Estás seguro de que deseas rechazar esta empresa?')) {
      try {
        await this.empresasService.rejectEmpresa(empresaId);
        alert('Empresa rechazada exitosamente');
        this.cargarEmpresas();
      } catch (error) {
        alert('Error al rechazar la empresa');
      }
    }
  }

  formatDate(fecha: any): Date {
    if (fecha && typeof fecha.toDate === 'function') {
      return fecha.toDate();
    }
    return fecha || new Date();
  }
}
