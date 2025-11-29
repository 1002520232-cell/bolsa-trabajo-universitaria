import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { Usuario } from '../../core/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="profile-container" *ngIf="user; else loadingOrLoginPrompt">
      <div class="profile-header">
        <h2>Mi Perfil</h2>
        <div class="role-badge" [ngClass]="user.rol">{{ user.rol | titlecase }}</div>
      </div>

      <!-- Profile Image Section -->
      <div class="profile-image-section">
        <img *ngIf="profileImageUrl; else defaultImage" [src]="profileImageUrl" alt="Profile Image" class="profile-image" />
        <ng-template #defaultImage>
          <div class="profile-image-placeholder">
            <i class="bi bi-person-circle"></i>
          </div>
        </ng-template>
        <div class="image-upload">
          <input type="file" id="profileImage" (change)="onFileSelected($event)" accept="image/*" style="display: none;" />
          <label for="profileImage" class="upload-button">
            <i class="bi bi-camera"></i>
            Cambiar foto
          </label>
        </div>
      </div>

      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <!-- Basic Information -->
        <div class="form-section">
          <h3>Información Básica</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">
                <i class="bi bi-person"></i>
                Nombre
              </label>
              <input type="text" id="nombre" formControlName="nombre" placeholder="Tu nombre">
            </div>
            <div class="form-group">
              <label for="apellido">
                <i class="bi bi-person"></i>
                Apellido
              </label>
              <input type="text" id="apellido" formControlName="apellido" placeholder="Tu apellido">
            </div>
          </div>

          <div class="form-group" *ngIf="user.rol === 'estudiante'">
            <label for="carrera">
              <i class="bi bi-mortarboard"></i>
              Carrera
            </label>
            <input type="text" id="carrera" formControlName="carrera" placeholder="Ej: Ingeniería de Sistemas">
          </div>

          <div class="form-group">
            <label for="telefono">
              <i class="bi bi-telephone"></i>
              Teléfono
            </label>
            <input type="tel" id="telefono" formControlName="telefono" placeholder="+57 300 123 4567">
          </div>

          <div class="form-group">
            <label for="descripcion">
              <i class="bi bi-file-text"></i>
              Descripción
            </label>
            <textarea id="descripcion" formControlName="descripcion" rows="4"
              placeholder="Cuéntanos sobre ti, tus intereses y objetivos profesionales..."></textarea>
          </div>
        </div>

        <!-- Company Information (for empresas) -->
        <div class="form-section" *ngIf="user.rol === 'empresa'">
          <h3>Información de la Empresa</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="empresaNombre">
                <i class="bi bi-building"></i>
                Nombre de la Empresa
              </label>
              <input type="text" id="empresaNombre" formControlName="empresaNombre" placeholder="Nombre de tu empresa">
            </div>
            <div class="form-group">
              <label for="empresaUbicacion">
                <i class="bi bi-geo-alt"></i>
                Ubicación
              </label>
              <input type="text" id="empresaUbicacion" formControlName="empresaUbicacion" placeholder="Ciudad, País">
            </div>
          </div>

          <div class="form-group">
            <label for="empresaSitioWeb">
              <i class="bi bi-globe"></i>
              Sitio Web de la Empresa
            </label>
            <input type="url" id="empresaSitioWeb" formControlName="empresaSitioWeb" placeholder="https://www.tuempresa.com">
          </div>

          <div class="form-group">
            <label for="empresaDescripcion">
              <i class="bi bi-file-text"></i>
              Descripción de la Empresa
            </label>
            <textarea id="empresaDescripcion" formControlName="empresaDescripcion" rows="4"
              placeholder="Describe tu empresa, su misión, visión y lo que buscan en sus empleados..."></textarea>
          </div>
        </div>

        <!-- Skills Section (for estudiantes) -->
        <div class="form-section" *ngIf="user.rol === 'estudiante'">
          <h3>Habilidades</h3>
          <div class="skills-section">
            <div class="skills-input">
              <input type="text" [(ngModel)]="newSkill" [ngModelOptions]="{standalone: true}"
                placeholder="Ej: JavaScript, Python, Liderazgo..." (keyup.enter)="addSkill()">
              <button type="button" (click)="addSkill()" class="add-skill-btn">
                <i class="bi bi-plus"></i>
              </button>
            </div>
            <div class="skills-list">
              <span *ngFor="let skill of skills; let i = index" class="skill-tag">
                {{ skill }}
                <button type="button" (click)="removeSkill(i)" class="remove-skill">
                  <i class="bi bi-x"></i>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- CV Upload Section (for estudiantes) -->
        <div class="form-section" *ngIf="user.rol === 'estudiante'">
          <h3>Curriculum Vitae</h3>
          <div class="cv-section">
            <div *ngIf="cvUrl; else noCv" class="cv-preview">
              <i class="bi bi-file-earmark-pdf"></i>
              <span>CV subido</span>
              <a [href]="cvUrl" target="_blank" class="cv-link">Ver CV</a>
            </div>
            <ng-template #noCv>
              <div class="no-cv">No has subido tu CV aún</div>
            </ng-template>
            <div class="cv-upload">
              <input type="file" id="cvFile" (change)="onCvSelected($event)" accept=".pdf,.doc,.docx" style="display: none;" />
              <label for="cvFile" class="upload-button">
                <i class="bi bi-upload"></i>
                {{ cvUrl ? 'Cambiar CV' : 'Subir CV' }}
              </label>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="form-section">
          <h3>Enlaces y Redes Sociales</h3>
          <div class="form-group">
            <label for="linkedinUrl">
              <i class="bi bi-linkedin"></i>
              LinkedIn
            </label>
            <input type="url" id="linkedinUrl" formControlName="linkedinUrl"
              placeholder="https://www.linkedin.com/in/tu-perfil">
          </div>

          <div class="form-group" *ngIf="user.rol === 'estudiante'">
            <label for="githubUrl">
              <i class="bi bi-github"></i>
              GitHub
            </label>
            <input type="url" id="githubUrl" formControlName="githubUrl"
              placeholder="https://github.com/tu-usuario">
          </div>

          <div class="form-group">
            <label for="sitioWebPersonal">
              <i class="bi bi-globe"></i>
              Sitio Web Personal
            </label>
            <input type="url" id="sitioWebPersonal" formControlName="sitioWebPersonal"
              placeholder="https://www.tu-sitio-web.com">
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="save-button" [disabled]="profileForm.invalid || loading">
            <span *ngIf="!loading">
              <i class="bi bi-check-circle"></i>
              Guardar Cambios
            </span>
            <span *ngIf="loading" class="loading-spinner">
              <i class="bi bi-arrow-repeat spin"></i>
              Guardando...
            </span>
          </button>
        </div>
      </form>

      <!-- Logout Button -->
      <div class="logout-section">
        <button class="logout-button" (click)="logout()">
          <i class="bi bi-box-arrow-right"></i>
          Cerrar Sesión
        </button>
      </div>

      <!-- Messages -->
      <div *ngIf="message" class="message" [ngClass]="{'success': message.includes('correctamente'), 'error': message.includes('Error')}">
        <i class="bi" [ngClass]="{'bi-check-circle': message.includes('correctamente'), 'bi-exclamation-triangle': message.includes('Error')}"></i>
        {{ message }}
      </div>
    </div>

    <ng-template #loadingOrLoginPrompt>
      <div class="loading-container">
        <div *ngIf="loading" class="loading-spinner">
          <i class="bi bi-arrow-repeat spin"></i>
          <p>Cargando perfil...</p>
        </div>
        <div *ngIf="!loading" class="no-auth">
          <i class="bi bi-shield-x"></i>
          <p>No estás autenticado o el perfil no está disponible.</p>
          <a routerLink="/login" class="login-link">Iniciar Sesión</a>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: #1a1a1a;
      color: white;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .profile-header h2 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .role-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .role-badge.estudiante {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.3);
    }

    .role-badge.empresa {
      background: rgba(118, 75, 162, 0.2);
      color: #764ba2;
      border: 1px solid rgba(118, 75, 162, 0.3);
    }

    .profile-image-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #667eea;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .profile-image-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      margin: 0 auto;
      border: 4px solid rgba(255, 255, 255, 0.1);
    }

    .image-upload {
      margin-top: 1rem;
    }

    .upload-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 12px;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .upload-button:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .form-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .form-section h3 {
      margin: 0 0 1.5rem 0;
      color: #667eea;
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .form-group label i {
      color: #667eea;
      font-size: 1rem;
    }

    .form-input, textarea {
      width: 100%;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus, textarea:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder, textarea::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .skills-section {
      margin-top: 1rem;
    }

    .skills-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .skills-input input {
      flex: 1;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
    }

    .add-skill-btn {
      padding: 0.75rem 1rem;
      background: #667eea;
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .add-skill-btn:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 20px;
      color: #667eea;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .remove-skill {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      padding: 0;
      font-size: 0.8rem;
      transition: color 0.3s ease;
    }

    .remove-skill:hover {
      color: #ff4757;
    }

    .cv-section {
      text-align: center;
    }

    .cv-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(46, 204, 113, 0.1);
      border: 1px solid rgba(46, 204, 113, 0.3);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .cv-preview i {
      font-size: 2rem;
      color: #2ecc71;
    }

    .cv-link {
      color: #2ecc71;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .cv-link:hover {
      color: #27ae60;
    }

    .no-cv {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1rem;
    }

    .form-actions {
      text-align: center;
      margin: 2rem 0;
    }

    .save-button {
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .save-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .save-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .logout-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout-button {
      width: 100%;
      padding: 1rem;
      background: rgba(255, 71, 87, 0.1);
      border: 2px solid rgba(255, 71, 87, 0.3);
      border-radius: 12px;
      color: #ff4757;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .logout-button:hover {
      background: rgba(255, 71, 87, 0.2);
      border-color: #ff4757;
      transform: translateY(-1px);
    }

    .message {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .message.success {
      background: rgba(46, 204, 113, 0.1);
      border: 1px solid rgba(46, 204, 113, 0.3);
      color: #2ecc71;
    }

    .message.error {
      background: rgba(255, 71, 87, 0.1);
      border: 1px solid rgba(255, 71, 87, 0.3);
      color: #ff4757;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      color: white;
    }

    .loading-container .loading-spinner {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .loading-container p {
      margin: 0.5rem 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .no-auth {
      text-align: center;
    }

    .no-auth i {
      font-size: 4rem;
      color: #ff4757;
      margin-bottom: 1rem;
    }

    .login-link {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .login-link:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .profile-container {
        margin: 1rem;
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .skills-input {
        flex-direction: column;
      }

      .cv-preview {
        flex-direction: column;
        text-align: center;
      }
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
  cvUrl: string | null = null;
  skills: string[] = [];
  newSkill = '';
  loading = false;
  message: string | null = null;

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
    console.log('🔄 Cargando datos del usuario...');
    try {
      this.user = await this.authService.getCurrentUserData();
      if (this.user) {
        console.log('✅ Datos del usuario cargados:', this.user);
        this.profileImageUrl = this.user.imagenUrl || null;
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

  async onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.loading = true;
    this.message = null;
    const path = `cvs/${this.user?.uid}_${Date.now()}.${file.name.split('.').pop()}`;

    try {
      const url = await this.storageService.uploadFile(file, path);
      this.cvUrl = url;

      if (this.user) {
        await this.authService.updateUserProfile(this.user.uid, { cvUrl: url });
        this.message = 'CV subido correctamente.';
      }
    } catch (error) {
      console.error('Error al subir CV:', error);
      this.message = 'Error al subir el CV.';
    } finally {
      this.loading = false;
    }
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

    const formValue = this.profileForm.value;
    const updates: Partial<Usuario> = {
      nombre: formValue.nombre || '',
      apellido: formValue.apellido || '',
      telefono: formValue.telefono || undefined,
      descripcion: formValue.descripcion || undefined,
      linkedinUrl: formValue.linkedinUrl || undefined,
      githubUrl: formValue.githubUrl || undefined,
      sitioWebPersonal: formValue.sitioWebPersonal || undefined,
      habilidades: this.skills.length > 0 ? this.skills : undefined
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
      this.router.navigate(['/login']);
    });
  }
}
