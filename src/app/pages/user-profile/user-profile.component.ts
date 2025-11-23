import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Usuario } from '../../core/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container" *ngIf="user; else loadingOrLoginPrompt">
      <h2>Mi Perfil</h2>

      <div class="profile-image-section">
        <img *ngIf="profileImageUrl; else defaultImage" [src]="profileImageUrl" alt="Profile Image" class="profile-image" />
        <ng-template #defaultImage>
          <div class="profile-image-placeholder">Sin imagen</div>
        </ng-template>
        <input type="file" (change)="onFileSelected($event)" />
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <label>
          Nombre:
          <input formControlName="nombre" />
        </label>
        <label>
          Apellido:
          <input formControlName="apellido" />
        </label>
        <label>
          Carrera:
          <input formControlName="carrera" />
        </label>

        <button type="submit" [disabled]="profileForm.invalid || loading">Guardar Cambios</button>
      </form>

      <button class="logout-button" (click)="logout()">Cerrar Sesión</button>

      <div *ngIf="message" class="message">{{ message }}</div>
    </div>
    <ng-template #loadingOrLoginPrompt>
      <p *ngIf="loading">Cargando perfil...</p>
      <p *ngIf="!loading">No estás autenticado o el perfil no está disponible.</p>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      max-width: 500px;
      margin: auto;
      padding: 1rem;
      background: #1a1a1a;
      color: white;
      border-radius: 8px;
    }
    .profile-image-section {
      text-align: center;
      margin-bottom: 1rem;
    }
    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.5rem;
      border: 2px solid #667eea;
    }
    .profile-image-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #333;
      color: #aaa;
      line-height: 120px;
      margin: auto;
      margin-bottom: 0.5rem;
    }
    form label {
      display: block;
      margin-bottom: 0.5rem;
    }
    form input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: none;
      margin-top: 0.25rem;
      background: #333;
      color: white;
    }
    form button {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    .logout-button {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: #ff4757;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-weight: bold;
      width: 100%;
    }
    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #333;
      border-radius: 4px;
      text-align: center;
      color: #ddd;
    }
  `]
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  user: Usuario | null = null;
  profileImageUrl: string | null = null;
  loading = false;
  message: string | null = null;

  profileForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    carrera: ['']
  });

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    console.log('🔄 Cargando datos del usuario...');
    try {
      this.user = await this.authService.getCurrentUserData();
      if (this.user) {
        console.log('✅ Datos del usuario cargados:', this.user);
        this.profileImageUrl = (this.user as any).imagenUrl || null;
        this.profileForm.patchValue({
          nombre: this.user.nombre,
          apellido: this.user.apellido,
          carrera: this.user.carrera || ''
        });
      } else {
        console.warn('⚠️ Usuario no encontrado o no autenticado');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.loading = true;
    const path = `profile_images/${this.user?.uid}_${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const url = await this.storageService.uploadFile(file, path);
      this.profileImageUrl = url;

      if (this.user) {
        // Actualizar solo imagenUrl para evitar incompatibilidades con Usuario
        await this.authService.updateUserProfile(this.user.uid, { imagenUrl: url } as any);
        this.message = 'Imagen de perfil actualizada correctamente.';
      }
    } catch (error) {
      this.message = 'Error al subir la imagen.';
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (!this.user) return;
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.message = null;

    // Convertir null a undefined para evitar error TypeScript
    const formValue = this.profileForm.value;
    const updates = {
      nombre: formValue.nombre || undefined,
      apellido: formValue.apellido || undefined,
      carrera: formValue.carrera || undefined
    };

    try {
      await this.authService.updateUserProfile(this.user.uid, updates as any);
      this.message = 'Perfil actualizado correctamente.';
      this.loadUser();
    } catch (error) {
      this.message = 'Error al actualizar el perfil.';
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
