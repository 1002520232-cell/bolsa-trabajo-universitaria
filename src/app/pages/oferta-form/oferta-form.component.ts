import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { Empresa } from '../../core/models/empresa.model';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
              <div *ngIf="draftRestored" class="alert alert-warning d-flex justify-content-between align-items-center">
                <div>Se restauró un borrador guardado automáticamente.</div>
                <div>
                  <button class="btn btn-sm btn-outline-secondary me-2" (click)="discardDraft()">Descartar borrador</button>
                </div>
              </div>
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
                <div class="mb-3">
                  <label for="imagen" class="form-label">Imagen (Opcional)</label>
                  <input 
                    type="file" 
                    class="form-control"
                    id="imagen"
                    (change)="onFileSelected($event)"
                    accept="image/*">
                  <div *ngIf="imagePreview" class="mt-3">
                    <img [src]="imagePreview" alt="Imagen seleccionada" class="img-thumbnail" style="max-height: 200px;">
                  </div>
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
                      <option value="">Seleccione una categoría</option>
                      <option value="practicas">Prácticas</option>
                      <option value="medio-tiempo">Medio Tiempo</option>
                      <option value="tiempo-completo">Tiempo Completo</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  <!-- more form controls for modalidad, ubicacion, salario, vacantes, requisitos, fechaInicio, fechaFin -->
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    {{ isEditMode ? 'Actualizar' : 'Crear' }}
                  </button>
                </div>
              </form>
              <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              <div *ngIf="successMessage" class="alert alert-success">{{ successMessage }}</div>
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
  imagePreview: string | null = null;
  // query params used to prefill form when coming from Admin -> Usuarios
  prefillParams: any = null;
  private autosaveSub: Subscription | null = null;
  private draftKey = 'ofertaFormDraft';
  draftRestored = false;

  ngOnInit(): void {
    this.initForm();
    this.cargarEmpresas();
    // leer queryParams para prefill
    this.route.queryParams.subscribe(params => {
      this.prefillParams = params || null;
      if (this.prefillParams?.titulo) {
        this.ofertaForm.patchValue({ titulo: this.prefillParams.titulo });
      }
      // try apply after empresas load (cargarEmpresas llamará tryApply)
    });
    // cargar draft si existe
    this.loadDraft();

    // suscribir cambios del formulario para auto-guardar
    this.autosaveSub = this.ofertaForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ).subscribe(() => this.saveDraft());
    
    this.ofertaId = this.route.snapshot.paramMap.get('id');
    if (this.ofertaId) {
      this.isEditMode = true;
      this.cargarOferta(this.ofertaId);
    }
  }

  ngOnDestroy(): void {
    if (this.autosaveSub) {
      this.autosaveSub.unsubscribe();
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
        // intentar aplicar prefill si hay params
        this.tryApplyEmpresaPrefill();
        // aplicar defaults adicionales
        this.applyDefaultsFromEmpresa();
      },
      error: (error) => console.error('Error al cargar empresas:', error)
    });
  }

  private tryApplyEmpresaPrefill(): void {
    if (!this.prefillParams || !this.empresas || this.empresas.length === 0) return;
    const { empresaNombre, empresaId } = this.prefillParams;
    if (empresaId) {
      const e = this.empresas.find(x => x.id === empresaId);
      if (e) this.ofertaForm.patchValue({ empresaId: e.id });
    } else if (empresaNombre) {
      const e = this.empresas.find(x => (x.nombre || '').toLowerCase() === (empresaNombre || '').toLowerCase());
      if (e) this.ofertaForm.patchValue({ empresaId: e.id });
    }
  }

  // apply defaults like title or ubicacion when empresa info available
  private applyDefaultsFromEmpresa(): void {
    if (!this.prefillParams || !this.empresas || this.empresas.length === 0) return;
    const { empresaNombre, empresaId } = this.prefillParams;
    let e = null as Empresa | null;
    if (empresaId) {
      e = this.empresas.find(x => x.id === empresaId) || null;
    } else if (empresaNombre) {
      e = this.empresas.find(x => (x.nombre || '').toLowerCase() === (empresaNombre || '').toLowerCase()) || null;
    }

    if (e) {
      // set ubicacion if empty
      const currentUbicacion = this.ofertaForm.get('ubicacion')?.value;
      if (!currentUbicacion && e.ubicacion) {
        this.ofertaForm.patchValue({ ubicacion: e.ubicacion });
      }

      // set a sensible default title if empty
      const currentTitulo = this.ofertaForm.get('titulo')?.value;
      if ((!currentTitulo || currentTitulo.trim() === '') && e.nombre) {
        this.ofertaForm.patchValue({ titulo: `Puesto en ${e.nombre}` });
      }
    }
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null;
    }
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
        this.ofertasService.updateOferta(this.ofertaId, ofertaData).then(() => {
          this.loading = false;
          this.successMessage = 'Oferta actualizada exitosamente';
          // limpiar draft
          localStorage.removeItem(this.getDraftKey());
          setTimeout(() => this.router.navigate(['/ofertas', this.ofertaId!]), 2000);
        }).catch(error => {
          this.loading = false;
          console.error('Error al actualizar:', error);
          this.errorMessage = 'Error al actualizar la oferta';
        });
      } else {
        this.ofertasService.createOferta(ofertaData).then((id) => {
          this.loading = false;
          this.successMessage = 'Oferta creada exitosamente';
          // limpiar draft
          localStorage.removeItem(this.getDraftKey());
          setTimeout(() => this.router.navigate(['/ofertas', id]), 2000);
        }).catch(error => {
          this.loading = false;
          console.error('Error al crear:', error);
          this.errorMessage = 'Error al crear la oferta';
        });
      }
    }
  }

  private getDraftKey(): string {
    // include ofertaId in key when editing
    return this.ofertaId ? `${this.draftKey}_${this.ofertaId}` : this.draftKey;
  }

  private saveDraft(): void {
    try {
      const value = this.ofertaForm.getRawValue();
      localStorage.setItem(this.getDraftKey(), JSON.stringify(value));
    } catch (err) {
      console.error('Error saving draft oferta:', err);
    }
  }

  private loadDraft(): void {
    try {
      const raw = localStorage.getItem(this.getDraftKey());
      if (!raw) return;
      const data = JSON.parse(raw);
      // only apply if form is mostly empty and not editing
      const isEmpty = Object.values(this.ofertaForm.getRawValue()).every(v => v === null || v === '' || (Array.isArray(v) && v.length === 0));
      if (isEmpty) {
        this.ofertaForm.patchValue(data);
        this.draftRestored = true;
      }
    } catch (err) {
      console.error('Error loading draft oferta:', err);
    }
  }

  discardDraft(): void {
    try {
      localStorage.removeItem(this.getDraftKey());
      this.draftRestored = false;
      // reset form to empty only if not editing
      if (!this.isEditMode) {
        this.ofertaForm.reset();
      }
    } catch (err) {
      console.error('Error discarding draft oferta:', err);
    }
  }
}
