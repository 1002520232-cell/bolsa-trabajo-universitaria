// src/app/shared/navbar/navbar.component.ts - MENÚ ESTILO APUESTAS
import { Component, inject, HostListener } from '@angular/core';
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
          <ng-container *ngIf="(userData$ | async); else guestNav">
            <a
              routerLink="/dashboard"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-link"
              (click)="closeMenu()">
              <i class="bi bi-speedometer2"></i>
              <span>DASHBOARD</span>
            </a>
          </ng-container>
          <ng-template #guestNav>
            <a
              routerLink="/home"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-link"
              (click)="closeMenu()">
              <i class="bi bi-house-door"></i>
              <span>INICIO</span>
            </a>
          </ng-template>
          <a
            routerLink="/ofertas"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-search"></i>
            <span>EXPLORAR</span>
          </a>
          <a
            routerLink="/empresas"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-building"></i>
            <span>EMPRESAS</span>
          </a>
          <a
            routerLink="/videos-aprendizaje"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMenu()">
            <i class="bi bi-play-circle"></i>
            <span>VIDEOS DE APRENDIZAJE</span>
          </a>
        </div>

        <!-- User Section -->
        <div class="navbar-actions">
          <div *ngIf="(userData$ | async) as user; else guestButtons" class="user-section">
            <!-- User Button -->
            <button class="user-button" (click)="toggleDropdown()" [class.active]="dropdownOpen">
              <div class="user-avatar">
                {{ user.nombre.charAt(0) }}{{ user.apellido.charAt(0) }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.nombre }}</span>
                <span class="user-role">
                  <i class="bi bi-star-fill"></i> {{ user.rol }}
                </span>
              </div>
              <i class="bi bi-chevron-down arrow" [class.rotate]="dropdownOpen"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="dropdown-overlay" *ngIf="dropdownOpen" (click)="closeDropdown()"></div>
            <div class="dropdown-menu-container" *ngIf="dropdownOpen" [@slideDown]>
              <div class="dropdown-header">
                <div class="user-avatar-large">
                  {{ user.nombre.charAt(0) }}{{ user.apellido.charAt(0) }}
                </div>
                <div class="user-details">
                  <h6>{{ user.nombre }} {{ user.apellido }}</h6>
                  <p>{{ user.email }}</p>
                  <span class="badge-role">
                    <i class="bi bi-shield-check"></i> {{ user.rol }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Mi Cuenta -->
              <div class="dropdown-section">
                <div class="section-title">MI CUENTA</div>
                <a routerLink="/dashboard" class="dropdown-item" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-speedometer2"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Dashboard</span>
                    <span class="item-description">Panel principal</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>

                <a routerLink="/mis-postulaciones" class="dropdown-item" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-file-text"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Mis Postulaciones</span>
                    <span class="item-description">Ver estado</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>

                <a routerLink="/mis-ofertas" class="dropdown-item" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-briefcase-fill"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Mis Ofertas</span>
                    <span class="item-description">Gestionar publicaciones</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>

                <a routerLink="/estadisticas" class="dropdown-item" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-graph-up"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Estadísticas</span>
                    <span class="item-description">Ver métricas</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Acciones Rápidas -->
              <div class="dropdown-section">
                <div class="section-title">ACCIONES RÁPIDAS</div>
                <a routerLink="/ofertas-form" class="dropdown-item highlight" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-plus-circle"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Nueva Oferta</span>
                    <span class="item-description">Publicar trabajo</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>

                <a routerLink="/empresas-form" class="dropdown-item highlight" (click)="closeDropdown()">
                  <div class="item-icon">
                    <i class="bi bi-building"></i>
                  </div>
                  <div class="item-content">
                    <span class="item-title">Nueva Empresa</span>
                    <span class="item-description">Registrar empresa</span>
                  </div>
                  <i class="bi bi-chevron-right item-arrow"></i>
                </a>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Cerrar Sesión -->
              <button class="dropdown-item logout" (click)="logout()">
                <div class="item-icon">
                  <i class="bi bi-box-arrow-right"></i>
                </div>
                <div class="item-content">
                  <span class="item-title">Cerrar Sesión</span>
                  <span class="item-description">Salir de tu cuenta</span>
                </div>
                <i class="bi bi-chevron-right item-arrow"></i>
              </button>
            </div>
          </div>

          <ng-template #guestButtons>
            <a routerLink="/login" class="btn-secondary">INICIAR SESIÓN</a>
            <a routerLink="/register" class="btn-primary">REGISTRARSE</a>
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

    /* Navigation */
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

    .nav-link:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.15);
    }

    /* User Section */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-section {
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

    .user-button:hover,
    .user-button.active {
      background: rgba(255, 255, 255, 0.1);
      border-color: #667eea;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
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
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-role {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .arrow {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .arrow.rotate {
      transform: rotate(180deg);
    }

    /* Dropdown */
    .dropdown-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dropdown-menu-container {
      position: absolute;
      top: calc(100% + 1rem);
      right: 0;
      width: 380px;
      max-height: 80vh;
      overflow-y: auto;
      background: #1a1a1a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      z-index: 1000;
      animation: slideDown 0.3s ease;
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

    .dropdown-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-avatar-large {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
      border: 3px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
    }

    .user-details {
      flex: 1;
    }

    .user-details h6 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .user-details p {
      margin: 0 0 0.5rem 0;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .badge-role {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.4);
      border-radius: 20px;
      font-size: 0.7rem;
      color: #667eea;
      text-transform: uppercase;
      font-weight: 600;
    }

    .dropdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0.5rem 0;
    }

    .dropdown-section {
      padding: 0.5rem;
    }

    .section-title {
      padding: 0.75rem 1rem 0.5rem 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 1px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.2s ease;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      transform: translateX(5px);
    }

    .dropdown-item.highlight:hover {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border-left: 3px solid #667eea;
    }

    .item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .dropdown-item:hover .item-icon {
      background: rgba(102, 126, 234, 0.2);
      color: #667eea;
    }

    .item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-title {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .item-description {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .item-arrow {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.3);
      transition: transform 0.2s ease;
    }

    .dropdown-item:hover .item-arrow {
      transform: translateX(5px);
      color: #667eea;
    }

    .dropdown-item.logout {
      color: #ff4757;
    }

    .dropdown-item.logout:hover {
      background: rgba(255, 71, 87, 0.1);
    }

    .dropdown-item.logout:hover .item-icon {
      background: rgba(255, 71, 87, 0.2);
      color: #ff4757;
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
      white-space: nowrap;
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

    /* Scrollbar */
    .dropdown-menu-container::-webkit-scrollbar {
      width: 6px;
    }

    .dropdown-menu-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .dropdown-menu-container::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
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

      .dropdown-menu-container {
        right: -1rem;
        width: calc(100vw - 2rem);
      }
    }
  `],
  animations: []
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-section')) {
      this.dropdownOpen = false;
    }
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
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.closeDropdown();
          this.router.navigate(['/']);
        },
        error: (error) => console.error('Error al cerrar sesión:', error)
      });
    }
  }
}