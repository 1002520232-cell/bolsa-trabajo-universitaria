import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OfertasService } from '../../core/services/ofertas.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { Empresa } from '../../core/models/empresa.model';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './oferta-form.component.html',
  styleUrls: ['./oferta-form.component.css']
})
export class OfertaFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ofertasService = inject(OfertasService);
  private empresasService = inject(EmpresasService);
  private storage = inject(Storage);

  ofertaForm!: FormGroup;
  empresas: Empresa[] = [];
  isEditMode = false;
  ofertaId: string | null = null;
  loading = false;
  uploadingImage = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  prefillParams: any = null;
  private autosaveSub: Subscription | null = null;
  private draftKey = 'ofertaFormDraft';
  draftRestored = false;

  ngOnInit(): void {
    this.initForm();
    this.cargarEmpresas();
    
    this.route.queryParams.subscribe(params => {
      this.prefillParams = params || null;
      if (this.prefillParams?.titulo) {
        this.ofertaForm.patchValue({ titulo: this.prefillParams.titulo });
      }
    });
    
    this.loadDraft();

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ofertaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  cargarEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.tryApplyEmpresaPrefill();
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
      const currentUbicacion = this.ofertaForm.get('ubicacion')?.value;
      if (!currentUbicacion && e.ubicacion) {
        this.ofertaForm.patchValue({ ubicacion: e.ubicacion });
      }

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

        if (oferta.imagenUrl) {
          this.imagePreview = oferta.imagenUrl;
        }

        this.requisitos.clear();
        (oferta.requisitos || []).forEach(req => {
          this.requisitos.push(this.fb.control(req, Validators.required));
        });
      },
      error: (error) => console.error('Error al cargar oferta:', error)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const input = document.getElementById('imagen') as HTMLInputElement;
    if (input) input.value = '';
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) return null;

    this.uploadingImage = true;
    try {
      const fileName = `ofertas/${Date.now()}_${this.selectedFile.name}`;
      const storageRef = ref(this.storage, fileName);
      const snapshot = await uploadBytes(storageRef, this.selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      this.uploadingImage = false;
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      this.uploadingImage = false;
      this.errorMessage = 'Error al subir la imagen';
      return null;
    }
  }

  async onSubmit(): Promise<void> {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.ofertaForm.controls).forEach(key => {
      this.ofertaForm.get(key)?.markAsTouched();
    });

    // Validar requisitos
    this.requisitos.controls.forEach(control => {
      control.markAsTouched();
    });

    if (!this.ofertaForm.valid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos';
      // Scroll al primer error
      setTimeout(() => {
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Subir imagen si hay una seleccionada
      let imagenUrl = this.imagePreview;
      if (this.selectedFile) {
        imagenUrl = await this.uploadImage();
      }

      const empresaSeleccionada = this.empresas.find(e => e.id === this.ofertaForm.value.empresaId);
      
      const ofertaData: any = {
        ...this.ofertaForm.value,
        empresaNombre: empresaSeleccionada?.nombre || '',
        requisitos: this.requisitos.value.filter((r: string) => r && r.trim() !== ''),
        fechaInicio: this.ofertaForm.value.fechaInicio ? new Date(this.ofertaForm.value.fechaInicio) : null,
        fechaFin: this.ofertaForm.value.fechaFin ? new Date(this.ofertaForm.value.fechaFin) : null,
        fechaPublicacion: new Date(),
        activa: true,
        postulacionesCount: 0,
        imagenUrl: imagenUrl || null
      };

      if (this.isEditMode && this.ofertaId) {
        await this.ofertasService.updateOferta(this.ofertaId, ofertaData);
        this.successMessage = 'Oferta actualizada exitosamente';
        localStorage.removeItem(this.getDraftKey());
        setTimeout(() => this.router.navigate(['/ofertas', this.ofertaId!]), 1500);
      } else {
        const id = await this.ofertasService.createOferta(ofertaData);
        this.successMessage = 'Oferta creada exitosamente';
        localStorage.removeItem(this.getDraftKey());
        setTimeout(() => this.router.navigate(['/ofertas', id]), 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error al guardar la oferta. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  private getDraftKey(): string {
    return this.ofertaId ? `${this.draftKey}_${this.ofertaId}` : this.draftKey;
  }

  private saveDraft(): void {
    try {
      const value = this.ofertaForm.getRawValue();
      localStorage.setItem(this.getDraftKey(), JSON.stringify(value));
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  }

  private loadDraft(): void {
    try {
      const raw = localStorage.getItem(this.getDraftKey());
      if (!raw) return;
      const data = JSON.parse(raw);
      const isEmpty = Object.values(this.ofertaForm.getRawValue()).every(v => 
        v === null || v === '' || (Array.isArray(v) && v.length === 0)
      );
      if (isEmpty && !this.isEditMode) {
        this.ofertaForm.patchValue(data);
        this.draftRestored = true;
      }
    } catch (err) {
      console.error('Error loading draft:', err);
    }
  }

  discardDraft(): void {
    try {
      localStorage.removeItem(this.getDraftKey());
      this.draftRestored = false;
      if (!this.isEditMode) {
        this.ofertaForm.reset();
        this.requisitos.clear();
        this.requisitos.push(this.fb.control('', Validators.required));
      }
    } catch (err) {
      console.error('Error discarding draft:', err);
    }
  }
}