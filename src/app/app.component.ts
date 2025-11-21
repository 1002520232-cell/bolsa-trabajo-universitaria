// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="footer mt-auto py-4 bg-light">
      <div class="container text-center">
        <p class="text-muted mb-0">
          © 2024 Bolsa de Trabajo Universitaria. Todos los derechos reservados.
        </p>
        <small class="text-muted">
          Desarrollado con Angular y Firebase
        </small>
      </div>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 200px);
    }
    .footer {
      margin-top: auto;
      border-top: 1px solid #dee2e6;
    }
  `]
})
export class AppComponent {
  title = 'Bolsa de Trabajo Universitaria';
}