// src/app/pages/register/register.component.ts - GUARDA EN FIRESTORE
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-box">
        <div class="register-header">
          <div class="logo">
            <i class="bi bi-person-plus"></i>
          </div>
          <h1>CREAR CUENTA</h1>
          <p>Únete a BolsaWork y encuentra tu oportunidad</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <!-- Nombre y Apellido -->
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">
                <i class="bi bi-person"></i>
                NOMBRE
              </label>
              <input 
                type="text" 
                id="nombre"
                class="form-input"
                formControlName="nombre"
                placeholder="Tu nombre"
                [class.error]="registerForm.get('nombre')?.invalid && registerForm.get('nombre')?.touched">
              <div class="error-message" *ngIf="registerForm.get('nombre')?.invalid && registerForm.get('nombre')?.touched">
                <i class="bi bi-exclamation-circle"></i> El nombre es requerido
              </div>
            </div>

            <div class="form-group">
              <label for="apellido">
                <i class="bi bi-person"></i>
                APELLIDO
              </label>
              <input 
                type="text" 
                id="apellido"
                class="form-input"
                formControlName="apellido"
                placeholder="Tu apellido"
                [class.error]="registerForm.get('apellido')?.invalid && registerForm.get('apellido')?.touched">
              <div class="error-message" *ngIf="registerForm.get('apellido')?.invalid && registerForm.get('apellido')?.touched">
                <i class="bi bi-exclamation-circle"></i> El apellido es requerido
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">
              <i class="bi bi-envelope"></i>
              CORREO ELECTRÓNICO
            </label>
            <input 
              type="email" 
              id="email"
              class="form-input"
              formControlName="email"
              placeholder="tucorreo@ejemplo.com"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              <span *ngIf="registerForm.get('email')?.hasError('required')">
                <i class="bi bi-exclamation-circle"></i> El correo es requerido
              </span>
              <span *ngIf="registerForm.get('email')?.hasError('email')">
                <i class="bi bi-exclamation-circle"></i> Ingresa un correo válido
              </span>
            </div>
          </div>

          <!-- Carrera -->
          <div class="form-group">
            <label for="carrera">
              <i class="bi bi-book"></i>
              CARRERA
            </label>
            <input 
              type="text" 
              id="carrera"
              class="form-input"
              formControlName="carrera"
              placeholder="Ej: Ingeniería de Sistemas"
              [class.error]="registerForm.get('carrera')?.invalid && registerForm.get('carrera')?.touched">
            <div class="error-message" *ngIf="registerForm.get('carrera')?.invalid && registerForm.get('carrera')?.touched">
              <i class="bi bi-exclamation-circle"></i> La carrera es requerida
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">
              <i class="bi bi-lock"></i>
              CONTRASEÑA
            </label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password"
                class="form-input"
                formControlName="password"
                placeholder="Mínimo 6 caracteres"
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar" [class.weak]="passwordStrength === 'weak'" [class.medium]="passwordStrength === 'medium'" [class.strong]="passwordStrength === 'strong'"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              <i class="bi bi-exclamation-circle"></i> Mínimo 6 caracteres
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword">
              <i class="bi bi-lock-fill"></i>
              CONFIRMAR CONTRASEÑA
            </label>
            <div class="password-input">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword"
                class="form-input"
                formControlName="confirmPassword"
                placeholder="Repite tu contraseña"
                [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              <button type="button" class="toggle-password" (click)="showConfirmPassword = !showConfirmPassword">
                <i class="bi" [ngClass]="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div class="error-message" *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
              <i class="bi bi-exclamation-circle"></i> Las contraseñas no coinciden
            </div>
          </div>

          <!-- Error global -->
          <div class="alert-error" *ngIf="errorMessage">
            <i class="bi bi-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <!-- Success -->
          <div class="alert-success" *ngIf="successMessage">
            <i class="bi bi-check-circle"></i>
            {{ successMessage }}
          </div>

          <!-- Submit -->
          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="registerForm.invalid || loading">
            <span *ngIf="!loading">
              <i class="bi bi-rocket-takeoff"></i>
              CREAR MI CUENTA
            </span>
            <span *ngIf="loading" class="loading-spinner">
              <i class="bi bi-arrow-repeat spin"></i>
              CREANDO CUENTA...
            </span>
          </button>
        </form>

        <div class="register-footer">
          <p>¿Ya tienes una cuenta?</p>
          <a routerLink="/login" class="link-login">
            INICIAR SESIÓN
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: 
        radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    }

    .register-box {
      width: 100%;
      max-width: 600px;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .register-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
    }

    .register-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .register-header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.08);
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .form-input.error {
      border-color: #ff4757;
    }

    .password-input {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      transition: color 0.3s ease;
    }

    .toggle-password:hover {
      color: white;
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .strength-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      position: relative;
      overflow: hidden;
    }

    .strength-bar::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      transition: width 0.3s ease, background 0.3s ease;
    }

    .strength-bar.weak::after {
      width: 33%;
      background: #ff4757;
    }

    .strength-bar.medium::after {
      width: 66%;
      background: #ffa502;
    }

    .strength-bar.strong::after {
      width: 100%;
      background: #2ecc71;
    }

    .strength-text {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      min-width: 80px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ff4757;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .alert-error {
      background: rgba(255, 71, 87, 0.1);
      border: 1px solid rgba(255, 71, 87, 0.3);
      border-radius: 12px;
      padding: 1rem;
      color: #ff4757;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .alert-success {
      background: rgba(46, 204, 113, 0.1);
      border: 1px solid rgba(46, 204, 113, 0.3);
      border-radius: 12px;
      padding: 1rem;
      color: #2ecc71;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      margin-top: 1rem;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .register-footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .register-footer p {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .link-login {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .link-login:hover {
      gap: 0.75rem;
      color: #764ba2;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .register-box {
        padding: 2rem 1.5rem;
      }

      .register-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: 'weak' | 'medium' | 'strong' | '' = '';
  passwordStrengthText = '';

  constructor() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      carrera: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Monitorear fuerza de contraseña
    this.registerForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordStrength(password);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  checkPasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = '';
      this.passwordStrengthText = '';
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const length = password.length;

    let strength = 0;
    if (length >= 6) strength++;
    if (length >= 8) strength++;
    if (hasNumber) strength++;
    if (hasUpper && hasLower) strength++;
    if (hasSpecial) strength++;

    if (strength <= 2) {
      this.passwordStrength = 'weak';
      this.passwordStrengthText = 'Débil';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
      this.passwordStrengthText = 'Media';
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthText = 'Fuerte';
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, password, nombre, apellido, carrera } = this.registerForm.value;

      console.log('Intentando registrar usuario...', { email, nombre, apellido, carrera });

      this.authService.register(email, password, nombre, apellido, carrera).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo...';
          console.log('Usuario registrado exitosamente');
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al registrar:', error);
          
          if (error.code === 'auth/email-already-in-use') {
            this.errorMessage = 'Este correo ya está registrado';
          } else if (error.code === 'auth/weak-password') {
            this.errorMessage = 'La contraseña es muy débil';
          } else if (error.code === 'auth/invalid-email') {
            this.errorMessage = 'El correo no es válido';
          } else {
            this.errorMessage = 'Error al crear cuenta. Intenta nuevamente.';
          }
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}