import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">Bolsa de Trabajo</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/home">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/ofertas">Ofertas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/empresas">Empresas</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {

}
