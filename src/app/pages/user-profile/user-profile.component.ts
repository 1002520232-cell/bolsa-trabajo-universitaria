import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Usuario } from '../../core/models/usuario.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ThemeToggleComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  user: Usuario | null = null;
  profileImageUrl: string | null = null;
  profileAvatarKey: string | null = null;
  cvUrl: string | null = null;
  cvFile: File | null = null;
  skills: string[] = [];
  newSkill = '';
  loading = false;
  message: string | null = null;
  avatars = [
    { key: 'dog', label: '🐶' },
    { key: 'cat', label: '🐱' },
    { key: 'panda', label: '🐼' },
    { key: 'monkey', label: '🐵' },
    { key: 'tiger', label: '🐯' },
    { key: 'frog', label: '🐸' },
    { key: 'rabbit', label: '🐰' },
    { key: 'cow', label: '🐮' }
  ];

  get avatarLabel(): string | null {
    if (!this.profileAvatarKey) return null;
    const found = this.avatars.find(a => a.key === this.profileAvatarKey);
    return found ? found.label : null;
  }

  profileForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    carrera: [''],
    telefono: [''],
    descripcion: [''],
    empresaNombre: [''],
    empresaUbicacion: [''],
    empresaSitioWeb: [''],
    empresaDescripcion: [''],
    linkedinUrl: [''],
    githubUrl: [''],
    sitioWebPersonal: ['']
  });

  constructor() {
    this.loadUser();
  }
  async loadUser() {
    this.loading = true;
    this.message = null;
    console.log('🔄 Cargando datos del usuario...');
    try {
      const queryUid = this.activatedRoute.snapshot.queryParamMap.get('uid');
      const currentUser = await this.authService.getCurrentUserData();

      if (queryUid) {
        // Si hay uid en query params, sólo permitir si el usuario autenticado es admin o es su propio uid
        if (!currentUser) {
          this.message = 'No estás autenticado.';
          this.user = null;
          return;
        }

        if (currentUser.uid === queryUid) {
          this.user = currentUser;
        } else if (currentUser.rol === 'admin') {
          const target = await this.authService.getUserById(queryUid);
          if (target) {
            this.user = target;
          } else {
            this.message = 'Usuario no encontrado.';
            this.user = null;
            return;
          }
        } else {
          this.message = 'No tienes permisos para editar este perfil.';
          this.user = null;
          return;
        }
      } else {
        // No se pasó uid => cargar perfil del usuario autenticado
        this.user = currentUser;
      }

      if (this.user) {
        console.log('✅ Datos del usuario cargados:', this.user);
        this.profileImageUrl = this.user.imagenUrl || null;
        this.profileAvatarKey = (this.user as any).avatarKey || null;
        this.cvUrl = this.user.cvUrl || null;
        this.skills = this.user.habilidades || [];

        this.profileForm.patchValue({
          nombre: this.user.nombre,
          apellido: this.user.apellido,
          carrera: this.user.carrera || '',
          telefono: this.user.telefono || '',
          descripcion: this.user.descripcion || '',
          empresaNombre: this.user.empresaNombre || '',
          empresaUbicacion: this.user.empresaUbicacion || '',
          empresaSitioWeb: this.user.empresaSitioWeb || '',
          empresaDescripcion: this.user.empresaDescripcion || '',
          linkedinUrl: this.user.linkedinUrl || '',
          githubUrl: this.user.githubUrl || '',
          sitioWebPersonal: this.user.sitioWebPersonal || ''
        });
      } else {
        console.warn('⚠️ Usuario no encontrado o no autenticado');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
      this.message = 'Error al cargar los datos del perfil.';
    } finally {
      this.loading = false;
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.loading = true;
    this.message = null;
    const path = `profile_images/${this.user?.uid}_${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const url = await this.storageService.uploadFile(file, path);
      this.profileImageUrl = url;

      if (this.user) {
        await this.authService.updateUserProfile(this.user.uid, { imagenUrl: url });
        this.message = 'Imagen de perfil actualizada correctamente.';
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      this.message = 'Error al subir la imagen.';
    } finally {
      this.loading = false;
    }
  }

  onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    // Store the file temporarily, will be uploaded on form submission
    this.cvFile = file;
    this.message = 'CV seleccionado. Recuerda guardar los cambios.';
  }

  async deleteProfileImage() {
    if (!this.user) return;
    if (!this.profileImageUrl) return;

    this.loading = true;
    this.message = null;

    try {
      // Only remove the URL from the user's Firestore document.
      await this.authService.updateUserProfile(this.user.uid, { imagenUrl: undefined, avatarKey: undefined });
      this.profileImageUrl = null;
      this.profileAvatarKey = null;
      this.message = 'Imagen de perfil eliminada.';
      // reload user data to keep local state in sync
      await this.loadUser();
    } catch (error) {
      console.error('Error al eliminar imagen de perfil:', error);
      this.message = 'Error al eliminar la imagen.';
    } finally {
      this.loading = false;
    }
  }

  selectAvatar(key: string) {
    this.profileAvatarKey = key;
    this.profileImageUrl = null;
    this.message = 'Avatar seleccionado. Recuerda guardar los cambios.';
  }

  addSkill() {
    if (this.newSkill.trim() && !this.skills.includes(this.newSkill.trim())) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  async onSubmit() {
    if (!this.user) return;
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.message = null;

    // Upload CV if selected
    let cvUrl = this.cvUrl;
    if (this.cvFile) {
      const path = `cvs/${this.user?.uid}_${Date.now()}.${this.cvFile.name.split('.').pop()}`;
      cvUrl = await this.storageService.uploadFile(this.cvFile, path);
      this.cvFile = null; // Clear the file after upload
    }

    const formValue = this.profileForm.value;
    const updates: Partial<Usuario> = {
      nombre: formValue.nombre || '',
      apellido: formValue.apellido || '',
      telefono: formValue.telefono || undefined,
      descripcion: formValue.descripcion || undefined,
      linkedinUrl: formValue.linkedinUrl || undefined,
      githubUrl: formValue.githubUrl || undefined,
      sitioWebPersonal: formValue.sitioWebPersonal || undefined,
      habilidades: this.skills.length > 0 ? this.skills : undefined,
      avatarKey: this.profileAvatarKey || undefined,
      imagenUrl: this.profileImageUrl || undefined,
      cvUrl: cvUrl || undefined
    };

    // Add role-specific fields
    if (this.user.rol === 'estudiante') {
      updates.carrera = formValue.carrera || undefined;
    } else if (this.user.rol === 'empresa') {
      updates.empresaNombre = formValue.empresaNombre || undefined;
      updates.empresaUbicacion = formValue.empresaUbicacion || undefined;
      updates.empresaSitioWeb = formValue.empresaSitioWeb || undefined;
      updates.empresaDescripcion = formValue.empresaDescripcion || undefined;
    }

    try {
      await this.authService.updateUserProfile(this.user.uid, updates);
      this.message = 'Perfil actualizado correctamente.';
      this.loadUser(); // Reload to get updated data
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      this.message = 'Error al actualizar el perfil.';
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
