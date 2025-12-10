import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { OfertasService } from '../../core/services/ofertas.service';
import { PostulacionesService } from '../../core/services/postulaciones.service';
import { Usuario } from '../../core/models/usuario.model';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';
import { Postulacion } from '../../core/models/postulacion.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out')
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private ofertasService = inject(OfertasService);
  private postulacionesService = inject(PostulacionesService);

  user: Usuario | null = null;
  recentOffers: OfertaLaboral[] = [];
  userApplications: Postulacion[] = [];
  totalApplications = 0;
  totalOffers = 0;

  ngOnInit() {
    this.loadUserData();
    this.loadRecentOffers();
    this.loadUserApplications();
  }

  private loadUserData() {
    this.authService.userData$.subscribe(user => {
      this.user = user;
    });
  }

  private loadRecentOffers() {
    this.ofertasService.getOfertas().subscribe(offers => {
      this.totalOffers = offers.length;
      this.recentOffers = offers
        .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
        .slice(0, 5);
    });
  }

  private loadUserApplications() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.postulacionesService.getPostulacionesByEstudiante(userId).subscribe(applications => {
        this.totalApplications = applications.length;
        this.userApplications = applications
          .sort((a, b) => new Date(b.fechaPostulacion).getTime() - new Date(a.fechaPostulacion).getTime())
          .slice(0, 5);
      });
    }
  }

  get formattedCreatedAt(): string {
    if (!this.user?.createdAt) return 'N/A';
    try {
      return (this.user.createdAt as any).toDate().toLocaleDateString('es-ES');
    } catch {
      return 'N/A';
    }
  }
}
