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
    <main class="main-wrapper">
      <router-outlet></router-outlet>
    </main>
    <footer class="epic-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h6>BOLSA<span class="highlight">WORK</span></h6>
            <p>Conectando talento universitario con oportunidades</p>
          </div>
          <div class="footer-section">
            <p>© 2024 BolsaWork. Desarrollado con Angular + Firebase</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-wrapper {
      flex: 1;
      padding-top: 2rem;
      padding-bottom: 2rem;
      min-height: calc(100vh - 200px);
    }

    .epic-footer {
      background: linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem 0;
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-section h6 {
      font-weight: 800;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .highlight {
      color: #667eea;
    }

    .footer-section p {
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class AppComponent {
  title = 'Bolsa de Trabajo Universitaria';
}