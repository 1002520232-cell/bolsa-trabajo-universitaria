// src/app/shared/navbar/navbar.component.ts - ESTILO EPIC GAMES
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../core/models/usuario.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="epic-navbar">
      <div class="navbar-container">
        <!-- Logo -->
        <div class="navbar-brand">
          <a routerLink="/home" class="logo">
            <i class="bi bi-briefcase-fill"></i>
            <span class="logo-text">BOLSA<span class="highlight">WORK</span></span>
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="navbar-menu" [class.active]="menuOpen">
          <a 
            routerLink="/home" 
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: true}"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-house-door"></i>
            <span>INICIO</span>
          </a>
          <a 
            routerLink="/ofertas" 
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-search"></i>
            <span>EXPLORAR OFERTAS</span>
          </a>
          <a 
            routerLink="/empresas" 
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-building"></i>
            <span>EMPRESAS</span>
          </a>
        </div>

        <!-- User Section -->
        <div class="navbar-actions">
          <div *ngIf="(userData$ | async) as user; else guestButtons" class="user-section">
            <div class="user-dropdown" [class.open]="dropdownOpen">
              <button class="user-button" (click)="toggleDropdown()">
                <div class="user-avatar">
                  {{ user.nombre.charAt(0) }}{{ user.apellido.charAt(0) }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.nombre }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
                <i class="bi bi-chevron-down arrow"></i>
              </button>
              
              <div class="dropdown-menu" *ngIf="dropdownOpen">
                <a routerLink="/dashboard" class="dropdown-item" (click)="closeDropdown()">
                  <i class="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </a>
                <a routerLink="/mis-postulaciones" class="dropdown-item" (click)="closeDropdown()">
                  <i class="bi bi-file-text"></i>
                  <span>Mis Postulaciones</span>
                </a>
                <a routerLink="/estadisticas" class="dropdown-item" (click)="closeDropdown()">
                  <i class="bi bi-graph-up"></i>
                  <span>Estadísticas</span>
                </a>
                <div class="dropdown-divider"></div>
                <a routerLink="/ofertas-form" class="dropdown-item" (click)="closeDropdown()">
                  <i class="bi bi-plus-circle"></i>
                  <span>Nueva Oferta</span>
                </a>
                <a routerLink="/empresas-form" class="dropdown-item" (click)="closeDropdown()">
                  <i class="bi bi-plus-circle"></i>
                  <span>Nueva Empresa</span>
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout" (click)="logout()">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>

          <ng-template #guestButtons>
            <a routerLink="/login" class="btn-secondary">INICIAR SESIÓN</a>
            <a routerLink="/register" class="btn-primary">OBTENER ACCESO</a>
          </ng-template>

          <button class="menu-toggle" (click)="toggleMenu()">
            <i class="bi" [ngClass]="menuOpen ? 'bi-x-lg' : 'bi-list'"></i>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .epic-navbar {
      background: linear-gradient(90deg, #0f0f0f 0%, #1a1a1a 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    /* Logo */
    .navbar-brand .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: white;
      font-weight: 800;
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .navbar-brand .logo:hover {
      transform: scale(1.05);
    }

    .logo i {
      font-size: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-text {
      letter-spacing: 2px;
    }

    .highlight {
      color: #667eea;
    }

    /* Navigation Menu */
    .navbar-menu {
      display: flex;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 1px;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link i {
      font-size: 1.2rem;
    }

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.15);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    /* User Section */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-dropdown {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-email {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .arrow {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .user-dropdown.open .arrow {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      min-width: 280px;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      animation: slideDown 0.3s ease;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .dropdown-item i {
      width: 20px;
      font-size: 1.1rem;
    }

    .dropdown-item.logout {
      color: #ff4757;
    }

    .dropdown-item.logout:hover {
      background: rgba(255, 71, 87, 0.1);
    }

    .dropdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0.5rem 0;
    }

    /* Buttons */
    .btn-secondary,
    .btn-primary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 1px;
      text-decoration: none;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .menu-toggle {
      display: none;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .navbar-menu {
        position: fixed;
        top: 80px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 80px);
        background: #0f0f0f;
        flex-direction: column;
        justify-content: flex-start;
        padding: 2rem;
        transition: left 0.3s ease;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .navbar-menu.active {
        left: 0;
      }

      .menu-toggle {
        display: block;
      }

      .user-info {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userData$: Observable<Usuario | null> = this.authService.userData$;
  menuOpen = false;
  dropdownOpen = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
      this.closeDropdown();
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.closeDropdown();
        },
        error: (error) => console.error('Error al cerrar sesión:', error)
      });
    }
  }
}