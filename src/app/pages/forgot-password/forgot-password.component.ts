import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-container">
      <div class="forgot-box">
        <div class="forgot-header">
          <div class="logo">
            <i class="bi bi-key"></i>
          </div>
          <h1>RECUPERAR CONTRASEÑA</h1>
          <p>Ingresa tu correo electrónico para recibir un enlace de recuperación</p>
        </div>

        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
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
              [class.error]="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
            <div class="error-message" *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched">
              <span *ngIf="forgotForm.get('email')?.hasError('required')">
                <i class="bi bi-exclamation-circle"></i> El correo es requerido
              </span>
              <span *ngIf="forgotForm.get('email')?.hasError('email')">
                <i class="bi bi-exclamation-circle"></i> Ingresa un correo válido
              </span>
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
            [disabled]="forgotForm.invalid || loading">
            <span *ngIf="!loading">
              <i class="bi bi-send"></i>
              ENVIAR ENLACE DE RECUPERACIÓN
            </span>
            <span *ngIf="loading" class="loading-spinner">
              <i class="bi bi-arrow-repeat spin"></i>
              ENVIANDO...
            </span>
          </button>
        </form>

        <!-- No tienes cuenta? -->
        <div class="register-section" *ngIf="emailNotFound">
          <p>¿No tienes una cuenta con este correo?</p>
          <a routerLink="/register" class="btn-register">
            <i class="bi bi-person-plus"></i>
            REGISTRARME
          </a>
        </div>

        <div class="forgot-footer">
          <p>¿Recordaste tu contraseña?</p>
          <a routerLink="/login" class="link-login">
            INICIAR SESIÓN
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background:
        radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    }

    .forgot-box {
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

    .forgot-header {
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

    .forgot-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .forgot-header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }

    .forgot-form {
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

    .register-section {
      text-align: center;
      margin: 2rem 0;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .register-section p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .btn-register {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
    }

    .forgot-footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .forgot-footer p {
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

    @media (max-width: 576px) {
      .forgot-box {
        padding: 2rem 1.5rem;
      }

      .forgot-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  emailNotFound = false;

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.emailNotFound = false;

      const { email } = this.forgotForm.value;

      this.authService.resetPassword(email).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = '¡Enlace de recuperación enviado! Revisa tu correo electrónico.';
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Error al enviar recuperación:', error);

          if (error.code === 'auth/user-not-found') {
            this.emailNotFound = true;
            this.errorMessage = 'No se encontró una cuenta con este correo electrónico.';
          } else if (error.code === 'auth/invalid-email') {
            this.errorMessage = 'El correo electrónico no es válido.';
          } else {
            this.errorMessage = 'Error al enviar el enlace de recuperación. Intenta nuevamente.';
          }
        }
      });
    }
  }
}
