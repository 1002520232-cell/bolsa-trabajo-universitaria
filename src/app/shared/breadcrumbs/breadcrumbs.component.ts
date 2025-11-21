// src/app/shared/breadcrumbs/breadcrumbs.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="breadcrumb" class="breadcrumb-container" *ngIf="breadcrumbs.length > 0">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <a routerLink="/home">
            <i class="bi bi-house-door"></i>
          </a>
        </li>
        <li 
          *ngFor="let breadcrumb of breadcrumbs; let last = last" 
          class="breadcrumb-item" 
          [class.active]="last"
          [attr.aria-current]="last ? 'page' : null">
          <a *ngIf="!last" [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
          <span *ngIf="last">{{ breadcrumb.label }}</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      margin-bottom: 1.5rem;
    }

    .breadcrumb {
      background: transparent;
      padding: 0;
    }

    .breadcrumb-item a {
      color: #667eea;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .breadcrumb-item a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .breadcrumb-item.active {
      color: #6c757d;
      font-weight: 500;
    }

    .breadcrumb-item + .breadcrumb-item::before {
      content: "›";
      color: #6c757d;
      padding: 0 0.5rem;
    }
  `]
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  breadcrumbs: Breadcrumb[] = [];

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = this.getLabel(child.snapshot.routeConfig?.title as string, routeURL);
      
      if (label && !this.isExcludedRoute(routeURL)) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabel(title: string | undefined, url: string): string {
    if (title) return title;
    
    const urlMap: { [key: string]: string } = {
      'ofertas': 'Ofertas Laborales',
      'empresas': 'Empresas',
      'dashboard': 'Dashboard',
      'mis-postulaciones': 'Mis Postulaciones',
      'estadisticas': 'Estadísticas',
      'ofertas-form': 'Formulario de Oferta',
      'empresas-form': 'Formulario de Empresa'
    };

    return urlMap[url] || url;
  }

  private isExcludedRoute(url: string): boolean {
    const excluded = ['home', 'login', 'register', '404'];
    return excluded.includes(url);
  }
}