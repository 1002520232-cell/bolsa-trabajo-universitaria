// src/app/pages/login/login.component.ts
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
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">
                <i class="bi bi-briefcase-fill text-primary"></i>
                Iniciar Sesión
              </h2>
              
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo Electrónico</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.hasError('required')">
                    El correo es requerido
                  </div>
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.hasError('email')">
                    Ingrese un correo válido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.hasError('required')">
                    La contraseña es requerida
                  </div>
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.hasError('minlength')">
                    Mínimo 6 caracteres
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  <i class="bi bi-exclamation-triangle"></i> {{ errorMessage }}
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    [disabled]="loginForm.invalid || loading">
                    <span *ngIf="!loading">Iniciar Sesión</span>
                    <span *ngIf="loading">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Ingresando...
                    </span>
                  </button>
                </div>
              </form>

              <hr class="my-4">
              
              <p class="text-center mb-0">
                ¿No tienes cuenta? 
                <a routerLink="/register" class="text-decoration-none">Regístrate aquí</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 15px;
      border: none;
    }
    .btn-primary {
      border-radius: 25px;
    }
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
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
  returnUrl: string = '/dashboard';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Obtener returnUrl de los query params
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
            this.errorMessage = 'Usuario no encontrado';
          } else if (error.code === 'auth/wrong-password') {
            this.errorMessage = 'Contraseña incorrecta';
          } else if (error.code === 'auth/invalid-credential') {
            this.errorMessage = 'Credenciales inválidas';
          } else {
            this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
          }
        }
      });
    }
  }
}