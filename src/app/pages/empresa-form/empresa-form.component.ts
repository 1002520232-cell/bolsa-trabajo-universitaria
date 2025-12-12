// src/app/pages/empresa-form/empresa-form.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EmpresasService } from '../../core/services/empresas.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-4 mb-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi" [ngClass]="isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
                {{ isEditMode ? 'Editar' : 'Nueva' }} Empresa
              </h3>
            </div>
            <div class="card-body p-4">
              <div *ngIf="draftRestored" class="alert alert-warning d-flex justify-content-between align-items-center">
                <div>Se restauró un borrador guardado automáticamente.</div>
                <div>
                  <button class="btn btn-sm btn-outline-secondary me-2" (click)="discardDraft()">Descartar borrador</button>
                </div>
              </div>
              <form [formGroup]="empresaForm" (ngSubmit)="onSubmit()">
                
                <h5 class="mb-3">Información Básica</h5>
                
                <div class="row">
                  <div class="col-md-8 mb-3">
                    <label for="nombre" class="form-label">Nombre de la Empresa *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="nombre"
                      formControlName="nombre"
                      placeholder="Ej: Tech Solutions SAC"
                      [class.is-invalid]="empresaForm.get('nombre')?.invalid && empresaForm.get('nombre')?.touched">
                    <div class="invalid-feedback">El nombre es requerido</div>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label for="ruc" class="form-label">RUC *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="ruc"
                      formControlName="ruc"
                      placeholder="20123456789"
                      maxlength="11"
                      [class.is-invalid]="empresaForm.get('ruc')?.invalid && empresaForm.get('ruc')?.touched">
                    <div class="invalid-feedback">
                      <span *ngIf="empresaForm.get('ruc')?.hasError('required')">El RUC es requerido</span>
                      <span *ngIf="empresaForm.get('ruc')?.hasError('pattern')">RUC inválido (11 dígitos)</span>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción *</label>
                  <textarea 
                    class="form-control" 
                    id="descripcion"
                    formControlName="descripcion"
                    rows="4"
                    placeholder="Describe la empresa, su misión, visión y valores..."
                    [class.is-invalid]="empresaForm.get('descripcion')?.invalid && empresaForm.get('descripcion')?.touched">
                  </textarea>
                  <div class="invalid-feedback">La descripción es requerida (mínimo 50 caracteres)</div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="sector" class="form-label">Sector *</label>
                    <select 
                      class="form-select" 
                      id="sector"
                      formControlName="sector"
                      [class.is-invalid]="empresaForm.get('sector')?.invalid && empresaForm.get('sector')?.touched">
                      <option value="">Seleccione un sector</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Educación">Educación</option>
                      <option value="Salud">Salud</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufactura">Manufactura</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Turismo">Turismo</option>
                      <option value="Otro">Otro</option>
                    </select>
                    <div class="invalid-feedback">El sector es requerido</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="ubicacion" class="form-label">Ubicación *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="ubicacion"
                      formControlName="ubicacion"
                      placeholder="Ej: Lima, Perú"
                      [class.is-invalid]="empresaForm.get('ubicacion')?.invalid && empresaForm.get('ubicacion')?.touched">
                    <div class="invalid-feedback">La ubicación es requerida</div>
                  </div>
                </div>

                <hr class="my-4">

                <h5 class="mb-3">Datos de Contacto</h5>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="telefono" class="form-label">Teléfono *</label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="telefono"
                      formControlName="telefono"
                      placeholder="+51 999 999 999"
                      [class.is-invalid]="empresaForm.get('telefono')?.invalid && empresaForm.get('telefono')?.touched">
                    <div class="invalid-feedback">El teléfono es requerido</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email *</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email"
                      formControlName="email"
                      placeholder="contacto@empresa.com"
                      [class.is-invalid]="empresaForm.get('email')?.invalid && empresaForm.get('email')?.touched">
                    <div class="invalid-feedback">
                      <span *ngIf="empresaForm.get('email')?.hasError('required')">El email es requerido</span>
                      <span *ngIf="empresaForm.get('email')?.hasError('email')">Email inválido</span>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="sitioWeb" class="form-label">Sitio Web (Opcional)</label>
                  <input 
                    type="url" 
                    class="form-control" 
                    id="sitioWeb"
                    formControlName="sitioWeb"
                    placeholder="https://www.empresa.com">
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
                  <a routerLink="/empresas" class="btn btn-outline-secondary">
                    <i class="bi bi-x-circle"></i> Cancelar
                  </a>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="empresaForm.invalid || loading">
                    <span *ngIf="!loading">
                      <i class="bi" [ngClass]="isEditMode ? 'bi-save' : 'bi-plus-circle'"></i>
                      {{ isEditMode ? 'Guardar Cambios' : 'Crear Empresa' }}
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
export class EmpresaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private empresasService = inject(EmpresasService);
  private authService = inject(AuthService);

  empresaForm!: FormGroup;
  isEditMode = false;
  empresaId: string | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  private autosaveSub: Subscription | null = null;
  private draftKey = 'empresaFormDraft';
  draftRestored = false;

  ngOnInit(): void {
    this.initForm();
    
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.isEditMode = true;
      this.cargarEmpresa(this.empresaId);
    }
    // leer queryParams para prefill cuando se viene desde Admin -> Usuarios
    this.route.queryParams.subscribe(async params => {
      if (!params) return;
      const fromUser = params['fromUser'];
      if (fromUser) {
        try {
          const user = await this.authService.getUserById(fromUser);
          if (user) {
            const nombre = user.empresaNombre || `${user.nombre} ${user.apellido}`;
            this.empresaForm.patchValue({
              nombre: nombre,
              ubicacion: user.empresaUbicacion || '',
              descripcion: user.empresaDescripcion || '',
              email: user.email || '',
              telefono: user.telefono || '',
              sitioWeb: user.empresaSitioWeb || user.sitioWebPersonal || ''
            });
          }
        } catch (err) {
          console.error('Error al obtener usuario para prefill empresa:', err);
        }
      }
    });
    // load draft
    this.loadDraft();

    // autosave on changes
    this.autosaveSub = this.empresaForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ).subscribe(() => this.saveDraft());
  }

  ngOnDestroy(): void {
    if (this.autosaveSub) this.autosaveSub.unsubscribe();
  }

  private getDraftKey(): string {
    return this.empresaId ? `${this.draftKey}_${this.empresaId}` : this.draftKey;
  }

  private saveDraft(): void {
    try {
      const value = this.empresaForm.getRawValue();
      localStorage.setItem(this.getDraftKey(), JSON.stringify(value));
    } catch (err) {
      console.error('Error saving draft empresa:', err);
    }
  }

  private loadDraft(): void {
    try {
      const raw = localStorage.getItem(this.getDraftKey());
      if (!raw) return;
      const data = JSON.parse(raw);
      const isEmpty = Object.values(this.empresaForm.getRawValue()).every(v => v === null || v === '' || (Array.isArray(v) && v.length === 0));
      if (isEmpty) {
        this.empresaForm.patchValue(data);
        this.draftRestored = true;
      }
    } catch (err) {
      console.error('Error loading draft empresa:', err);
    }
  }

  discardDraft(): void {
    try {
      localStorage.removeItem(this.getDraftKey());
      this.draftRestored = false;
      if (!this.isEditMode) this.empresaForm.reset();
    } catch (err) {
      console.error('Error discarding draft empresa:', err);
    }
  }

  initForm(): void {
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      descripcion: ['', [Validators.required, Validators.minLength(50)]],
      sector: ['', Validators.required],
      ubicacion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sitioWeb: ['']
    });
  }

  cargarEmpresa(id: string): void {
    this.empresasService.getEmpresaById(id).subscribe({
      next: (empresa) => {
        this.empresaForm.patchValue({
          nombre: empresa.nombre,
          ruc: empresa.ruc,
          descripcion: empresa.descripcion,
          sector: empresa.sector,
          ubicacion: empresa.ubicacion,
          telefono: empresa.telefono,
          email: empresa.email,
          sitioWeb: empresa.sitioWeb
        });
      },
      error: (error) => console.error('Error al cargar empresa:', error)
    });
  }

  async onSubmit(): Promise<void> {
    if (this.empresaForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const empresaData = this.empresaForm.value;

      if (this.isEditMode && this.empresaId) {
        try {
          await this.empresasService.updateEmpresa(this.empresaId, empresaData);
          this.loading = false;
          this.successMessage = 'Empresa actualizada exitosamente';
          // limpiar draft
          localStorage.removeItem(this.getDraftKey());
          setTimeout(() => this.router.navigate(['/empresas', this.empresaId!]), 2000);
        } catch (error: any) {
          this.loading = false;
          console.error('Error al actualizar:', error);
          this.errorMessage = 'Error al actualizar la empresa';
        }
      } else {
        try {
          const id = await this.empresasService.createEmpresa(empresaData);
          this.loading = false;
          this.successMessage = 'Empresa creada exitosamente';
          // limpiar draft
          localStorage.removeItem(this.getDraftKey());
          setTimeout(() => this.router.navigate(['/empresas', id]), 2000);
        } catch (error: any) {
          this.loading = false;
          console.error('Error al crear:', error);
          this.errorMessage = 'Error al crear la empresa';
        }
      }
    }
  }
}