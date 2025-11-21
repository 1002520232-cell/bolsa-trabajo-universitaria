// src/app/pages/oferta-form/oferta-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { Empresa } from '../../core/models/empresa.model';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-4 mb-5">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi" [ngClass]="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
                {{ isEditMode ? 'Editar' : 'Nueva' }} Oferta Laboral
              </h3>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="ofertaForm" (ngSubmit)="onSubmit()">
                
                <!-- Información básica -->
                <h5 class="mb-3">Información Básica</h5>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="empresaId" class="form-label">Empresa *</label>
                    <select 
                      class="form-select" 
                      id="empresaId"
                      formControlName="empresaId"
                      [class.is-invalid]="ofertaForm.get('empresaId')?.invalid && ofertaForm.get('empresaId')?.touched">
                      <option value="">Seleccione una empresa</option>
                      <option *ngFor="let empresa of empresas" [value]="empresa.id">
                        {{ empresa.nombre }}
                      </option>
                    </select>
                    <div class="invalid-feedback">La empresa es requerida</div>
                    <small class="text-muted">
                      ¿No encuentras tu empresa? 
                      <a routerLink="/empresas-form" class="text-decoration-none">Créala aquí</a>
                    </small>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="titulo" class="form-label">Título del Puesto *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="titulo"
                      formControlName="titulo"
                      placeholder="Ej: Desarrollador Frontend Junior"
                      [class.is-invalid]="ofertaForm.get('titulo')?.invalid && ofertaForm.get('titulo')?.touched">
                    <div class="invalid-feedback">El título es requerido</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción *</label>
                  <textarea 
                    class="form-control" 
                    id="descripcion"
                    formControlName="descripcion"
                    rows="4"
                    placeholder="Describe el puesto, responsabilidades y perfil buscado..."
                    [class.is-invalid]="ofertaForm.get('descripcion')?.invalid && ofertaForm.get('descripcion')?.touched">
                  </textarea>
                  <div class="invalid-feedback">La descripción es requerida (mínimo 50 caracteres)</div>
                </div>

                <hr class="my-4">

                <!-- Detalles del puesto -->
                <h5 class="mb-3">Detalles del Puesto</h5>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="categoria" class="form-label">Categoría *</label>
                    <select 
                      class="form-select" 
                      id="categoria"
                      formControlName="categoria"
                      [class.is-invalid]="ofertaForm.get('categoria')?.invalid && ofertaForm.get('categoria')?.touched">
                      <option value="">Seleccione</option>
                      <option value="practicas">Prácticas</option>
                      <option value="medio-tiempo">Medio Tiempo</option>
                      <option value="tiempo-completo">Tiempo Completo</option>
                      <option value="freelance">Freelance</option>
                    </select>
                    <div class="invalid-feedback">La categoría es requerida</div>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label for="modalidad" class="form-label">Modalidad *</label>
                    <select 
                      class="form-select" 
                      id="modalidad"
                      formControlName="modalidad"
                      [class.is-invalid]="ofertaForm.get('modalidad')?.invalid && ofertaForm.get('modalidad')?.touched">
                      <option value="">Seleccione</option>
                      <option value="presencial">Presencial</option>
                      <option value="remoto">Remoto</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                    <div class="invalid-feedback">La modalidad es requerida</div>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label for="ubicacion" class="form-label">Ubicación *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="ubicacion"
                      formControlName="ubicacion"
                      placeholder="Ej: Lima, Perú"
                      [class.is-invalid]="ofertaForm.get('ubicacion')?.invalid && ofertaForm.get('ubicacion')?.touched">
                    <div class="invalid-feedback">La ubicación es requerida</div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="salario" class="form-label">Salario (Opcional)</label>
                    <div class="input-group">
                      <span class="input-group-text">S/.</span>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="salario"
                        formControlName="salario"
                        placeholder="0">
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="vacantes" class="form-label">Número de Vacantes *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="vacantes"
                      formControlName="vacantes"
                      min="1"
                      [class.is-invalid]="ofertaForm.get('vacantes')?.invalid && ofertaForm.get('vacantes')?.touched">
                    <div class="invalid-feedback">Ingrese el número de vacantes</div>
                  </div>
                </div>

                <hr class="my-4">

                <!-- Requisitos -->
                <h5 class="mb-3">Requisitos</h5>
                
                <div formArrayName="requisitos">
                  <div *ngFor="let requisito of requisitos.controls; let i = index" class="mb-3">
                    <div class="input-group">
                      <span class="input-group-text">{{ i + 1 }}</span>
                      <input 
                        type="text" 
                        class="form-control" 
                        [formControlName]="i"
                        placeholder="Ej: Conocimientos en Angular">
                      <button 
                        type="button" 
                        class="btn btn-outline-danger"
                        (click)="removeRequisito(i)"
                        [disabled]="requisitos.length === 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  class="btn btn-outline-primary btn-sm"
                  (click)="addRequisito()">
                  <i class="bi bi-plus-circle"></i> Agregar Requisito
                </button>

                <hr class="my-4">

                <!-- Fechas -->
                <h5 class="mb-3">Fechas (Opcional)</h5>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="fechaInicio" class="form-label">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="fechaInicio"
                      formControlName="fechaInicio">
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="fechaFin" class="form-label">Fecha de Cierre</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="fechaFin"
                      formControlName="fechaFin">
                  </div>
                </div>

                <!-- Mensajes -->
                <div class="alert alert-danger" *ngIf="errorMessage">
                  <i class="bi bi-exclamation-triangle"></i> {{ errorMessage }}
                </div>

                <div class="alert alert-success" *ngIf="successMessage">
                  <i class="bi bi-check-circle"></i> {{ successMessage }}
                </div>

                <!-- Botones -->
                <div class="d-flex gap-2 justify-content-end">
                  <a routerLink="/ofertas" class="btn btn-outline-secondary">
                    <i class="bi bi-x-circle"></i> Cancelar
                  </a>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="ofertaForm.invalid || loading">
                    <span *ngIf="!loading">
                      <i class="bi" [ngClass]="isEditMode ? 'bi-save' : 'bi-plus-circle'"></i>
                      {{ isEditMode ? 'Guardar Cambios' : 'Crear Oferta' }}
                    </span>
                    <span *ngIf="loading">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OfertaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ofertasService = inject(OfertasService);
  private empresasService = inject(EmpresasService);

  ofertaForm!: FormGroup;
  empresas: Empresa[] = [];
  isEditMode = false;
  ofertaId: string | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.initForm();
    this.cargarEmpresas();
    
    this.ofertaId = this.route.snapshot.paramMap.get('id');
    if (this.ofertaId) {
      this.isEditMode = true;
      this.cargarOferta(this.ofertaId);
    }
  }

  initForm(): void {
    this.ofertaForm = this.fb.group({
      empresaId: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(50)]],
      categoria: ['', Validators.required],
      modalidad: ['', Validators.required],
      ubicacion: ['', Validators.required],
      salario: [null],
      vacantes: [1, [Validators.required, Validators.min(1)]],
      requisitos: this.fb.array([this.fb.control('', Validators.required)]),
      fechaInicio: [null],
      fechaFin: [null]
    });
  }

  get requisitos(): FormArray {
    return this.ofertaForm.get('requisitos') as FormArray;
  }

  addRequisito(): void {
    this.requisitos.push(this.fb.control('', Validators.required));
  }

  removeRequisito(index: number): void {
    if (this.requisitos.length > 1) {
      this.requisitos.removeAt(index);
    }
  }

  cargarEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
      },
      error: (error) => console.error('Error al cargar empresas:', error)
    });
  }

  cargarOferta(id: string): void {
    this.ofertasService.getOfertaById(id).subscribe({
      next: (oferta) => {
        const fechaInicioStr = oferta.fechaInicio ?
          ((oferta.fechaInicio as any).toDate ? new Date((oferta.fechaInicio as any).toDate()).toISOString().split('T')[0] : oferta.fechaInicio) : null;
        const fechaFinStr = oferta.fechaFin ?
          ((oferta.fechaFin as any).toDate ? new Date((oferta.fechaFin as any).toDate()).toISOString().split('T')[0] : oferta.fechaFin) : null;

        this.ofertaForm.patchValue({
          empresaId: oferta.empresaId,
          titulo: oferta.titulo,
          descripcion: oferta.descripcion,
          categoria: oferta.categoria,
          modalidad: oferta.modalidad,
          ubicacion: oferta.ubicacion,
          salario: oferta.salario,
          vacantes: oferta.vacantes,
          fechaInicio: fechaInicioStr,
          fechaFin: fechaFinStr
        });

        this.requisitos.clear();
        oferta.requisitos.forEach(req => {
          this.requisitos.push(this.fb.control(req, Validators.required));
        });
      },
      error: (error) => console.error('Error al cargar oferta:', error)
    });
  }

  onSubmit(): void {
    if (this.ofertaForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const empresaSeleccionada = this.empresas.find(e => e.id === this.ofertaForm.value.empresaId);
      
      const ofertaData = {
        ...this.ofertaForm.value,
        empresaNombre: empresaSeleccionada?.nombre || '',
        requisitos: this.requisitos.value.filter((r: string) => r.trim() !== ''),
        fechaInicio: this.ofertaForm.value.fechaInicio ? new Date(this.ofertaForm.value.fechaInicio) : null,
        fechaFin: this.ofertaForm.value.fechaFin ? new Date(this.ofertaForm.value.fechaFin) : null
      };

      if (this.isEditMode && this.ofertaId) {
        this.ofertasService.updateOferta(this.ofertaId, ofertaData).subscribe({
          next: () => {
            this.loading = false;
            this.successMessage = 'Oferta actualizada exitosamente';
            setTimeout(() => this.router.navigate(['/ofertas', this.ofertaId]), 2000);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error al actualizar:', error);
            this.errorMessage = 'Error al actualizar la oferta';
          }
        });
      } else {
        this.ofertasService.createOferta(ofertaData).subscribe({
          next: (id) => {
            this.loading = false;
            this.successMessage = 'Oferta creada exitosamente';
            setTimeout(() => this.router.navigate(['/ofertas', id]), 2000);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error al crear:', error);
            this.errorMessage = 'Error al crear la oferta';
          }
        });
      }
    }
  }
}