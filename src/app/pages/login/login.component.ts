// src/app/pages/login/login.component.ts - ESTILO EPIC GAMES
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <div class="logo">
            <i class="bi bi-briefcase-fill"></i>
          </div>
          <h1>INICIAR SESIÓN</h1>
          <p>Accede a tu cuenta de BolsaWork</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
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
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.hasError('required')">
                <i class="bi bi-exclamation-circle"></i> El correo es requerido
              </span>
              <span *ngIf="loginForm.get('email')?.hasError('email')">
                <i class="bi bi-exclamation-circle"></i> Ingresa un correo válido
              </span>
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
                placeholder="Ingresa tu contraseña"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.hasError('required')">
                <i class="bi bi-exclamation-circle"></i> La contraseña es requerida
              </span>
              <span *ngIf="loginForm.get('password')?.hasError('minlength')">
                <i class="bi bi-exclamation-circle"></i> Mínimo 6 caracteres
              </span>
            </div>
          </div>

          <!-- Error global -->
          <div class="alert-error" *ngIf="errorMessage">
            <i class="bi bi-exclamation-triangle"></i>
            {{ errorMessage }}
          </div>

          <!-- Submit -->
          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">
              <i class="bi bi-box-arrow-in-right"></i>
              INICIAR SESIÓN
            </span>
            <span *ngIf="loading" class="loading-spinner">
              <i class="bi bi-arrow-repeat spin"></i>
              INGRESANDO...
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>¿No tienes una cuenta?</p>
          <a routerLink="/register" class="link-register">
            CREAR CUENTA GRATIS
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: 
        radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    }

    .login-box {
      width: 100%;
      max-width: 480px;
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

    .login-header {
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

    .login-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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

    .login-footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .login-footer p {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .link-register {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #667eea;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .link-register:hover {
      gap: 0.75rem;
      color: #764ba2;
    }

    @media (max-width: 576px) {
      .login-box {
        padding: 2rem 1.5rem;
      }

      .login-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/dashboard';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al iniciar sesión:', error);
          
          if (error.code === 'auth/user-not-found') {
            this.errorMessage = 'No existe una cuenta con este correo';
          } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            this.errorMessage = 'Correo o contraseña incorrectos';
          } else if (error.code === 'auth/too-many-requests') {
            this.errorMessage = 'Demasiados intentos. Intenta más tarde';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales';
          }
        }
      });
    }
  }
}